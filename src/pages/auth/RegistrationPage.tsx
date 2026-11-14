import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  createRegisteredUser,
  UserEmailAlreadyExistsError,
  UserStorageQuotaError,
  type CafeApplicationDetails,
  type CafeApplicationDocument,
  type CafeDocumentMimeType,
} from '@/api/users'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePageTitle } from '@/hooks/use-page-title'

export type AccountRole = 'supplier' | 'cafe'

const MAX_CAFE_DOCUMENT_SIZE = 1024 * 1024
const CAFE_DOCUMENT_MIME_TYPES: Record<string, CafeDocumentMimeType> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
}

class CafeDocumentReadError extends Error {
  constructor() {
    super('A café license document could not be read.')
    this.name = 'CafeDocumentReadError'
  }
}

function getCafeDocumentMimeType(file: File): CafeDocumentMimeType | null {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !(extension in CAFE_DOCUMENT_MIME_TYPES)) return null

  const mimeType = CAFE_DOCUMENT_MIME_TYPES[extension]
  return !file.type || file.type === mimeType ? mimeType : null
}

function readCafeDocument(
  file: File,
  mimeType: CafeDocumentMimeType,
): Promise<CafeApplicationDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new CafeDocumentReadError())
        return
      }

      const separator = reader.result.indexOf(',')
      if (separator < 0) {
        reject(new CafeDocumentReadError())
        return
      }

      resolve({
        fileName: file.name,
        mimeType,
        dataUrl: `data:${mimeType};base64,${reader.result.slice(separator + 1)}`,
      })
    }
    reader.onerror = () => reject(new CafeDocumentReadError())
    reader.readAsDataURL(file)
  })
}

type RegistrationPageProps = {
  role: AccountRole
}

export function RegistrationPage({ role }: RegistrationPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  usePageTitle(t('registration.title'))

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setMessage('')
    const formData = new FormData(event.currentTarget)
    let cafeDocumentFiles:
      | [File, CafeDocumentMimeType, File, CafeDocumentMimeType]
      | null = null

    if (role === 'supplier') {
      const today = new Date()
      const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
      ].join('-')
      const authorizationExpiry = String(formData.get('authorizationExpiry') ?? '')
      const healthCertificateExpiry = String(formData.get('healthCertificateExpiry') ?? '')

      if (authorizationExpiry < localToday || healthCertificateExpiry < localToday) {
        setMessage('')
        setFormError(t('registration.expiredDocument'))
        return
      }
    }

    if (role === 'cafe') {
      const registrationFileValue = formData.get('commercialRegistrationDocument')
      const operatingLicenseValue = formData.get('operatingLicenseDocument')
      const registrationFile =
        registrationFileValue instanceof File ? registrationFileValue : null
      const operatingLicenseFile =
        operatingLicenseValue instanceof File ? operatingLicenseValue : null

      if (
        !registrationFile ||
        registrationFile.size === 0 ||
        !operatingLicenseFile ||
        operatingLicenseFile.size === 0
      ) {
        setFormError(t('registration.cafeDocumentsRequired'))
        return
      }
      if (
        registrationFile.size > MAX_CAFE_DOCUMENT_SIZE ||
        operatingLicenseFile.size > MAX_CAFE_DOCUMENT_SIZE
      ) {
        setFormError(t('registration.documentTooLarge'))
        return
      }

      const registrationMimeType = getCafeDocumentMimeType(registrationFile)
      const operatingLicenseMimeType = getCafeDocumentMimeType(operatingLicenseFile)
      if (!registrationMimeType || !operatingLicenseMimeType) {
        setFormError(t('registration.documentFormatInvalid'))
        return
      }
      cafeDocumentFiles = [
        registrationFile,
        registrationMimeType,
        operatingLicenseFile,
        operatingLicenseMimeType,
      ]
    }

    if (formData.get('password') !== formData.get('confirmPassword')) {
      setFormError(t('registration.passwordMismatch'))
      return
    }

    setSubmitting(true)
    const name = String(formData.get('businessName') ?? '').trim()
    try {
      let cafeApplication: CafeApplicationDetails | undefined
      if (role === 'cafe') {
        if (!cafeDocumentFiles) {
          setFormError(t('registration.cafeDocumentsRequired'))
          return
        }
        const [
          registrationFile,
          registrationMimeType,
          operatingLicenseFile,
          operatingLicenseMimeType,
        ] = cafeDocumentFiles
        const [
          commercialRegistrationDocument,
          operatingLicenseDocument,
        ] = await Promise.all([
          readCafeDocument(registrationFile, registrationMimeType),
          readCafeDocument(operatingLicenseFile, operatingLicenseMimeType),
        ])
        cafeApplication = {
          registeredBusinessName: String(formData.get('registeredBusinessName') ?? '').trim(),
          commercialRegistration: String(formData.get('commercialRegistration') ?? '').trim(),
          vatNumber: String(formData.get('vatNumber') ?? '').trim(),
          city: String(formData.get('city') ?? '').trim(),
          district: String(formData.get('district') ?? '').trim(),
          street: String(formData.get('street') ?? '').trim(),
          buildingNumber: String(formData.get('buildingNumber') ?? '').trim(),
          postalCode: String(formData.get('postalCode') ?? '').trim(),
          shortAddress: String(formData.get('shortAddress') ?? '').trim(),
          commercialRegistrationDocument,
          operatingLicenseDocument,
        }
      }
      await createRegisteredUser({
        name,
        email: String(formData.get('email') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
        role,
        ...(cafeApplication ? { cafeApplication } : {}),
      })
      setMessage(t('registration.success'))
      if (role === 'supplier') setSupplierName(name)
    } catch (error) {
      setFormError(
        error instanceof UserEmailAlreadyExistsError
          ? t('registration.emailExists')
          : error instanceof UserStorageQuotaError
            ? t('registration.storageFull')
            : error instanceof CafeDocumentReadError
              ? t('registration.documentReadError')
              : t('registration.saveError'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell>
      <main className="auth-page">
        <section
          className={role === 'cafe' ? 'form-screen business-register' : 'form-screen supplier-register'}
          aria-labelledby="register-title"
        >
          <header className="auth-heading">
            <h1 id="register-title">{t('registration.title')}</h1>
            <p>{t(role === 'supplier' ? 'registration.supplierDescription' : 'registration.cafeDescription')}</p>
          </header>

          <form className="auth-form" onSubmit={handleRegister}>
            <FieldGroup className="auth-fields">
              <Field>
                <FieldLabel htmlFor="business-name">
                  {t(role === 'supplier' ? 'common.businessName' : 'common.cafeName')}
                </FieldLabel>
                <Input id="business-name" name="businessName" autoComplete="organization" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="register-email">{t('common.email')}</FieldLabel>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  placeholder={t('common.emailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </Field>

              <div className="auth-field-row">
                <Field>
                  <FieldLabel htmlFor="register-phone">{t('common.phone')}</FieldLabel>
                  <Input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    placeholder="+966"
                    autoComplete="tel"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">{t('common.city')}</FieldLabel>
                  <Input id="city" name="city" autoComplete="address-level2" required />
                </Field>
              </div>

              {role === 'cafe' && (
                <FieldSet className="business-details">
                  <FieldLegend>{t('registration.businessDetails')}</FieldLegend>
                  <Field>
                    <FieldLabel htmlFor="registered-business-name">
                      {t('registration.registeredBusinessName')}
                    </FieldLabel>
                    <Input
                      id="registered-business-name"
                      name="registeredBusinessName"
                      autoComplete="organization"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="commercial-registration">
                      {t('registration.commercialRegistration')}
                    </FieldLabel>
                    <Input
                      id="commercial-registration"
                      name="commercialRegistration"
                      inputMode="numeric"
                      autoComplete="off"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vat-number">
                      {t('registration.vatNumber')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="vat-number" name="vatNumber" inputMode="numeric" autoComplete="off" />
                  </Field>
                  <p className="business-details-note">{t('registration.vatHelp')}</p>
                  <p className="business-details-label">{t('registration.nationalAddress')}</p>
                  <div className="auth-field-row">
                    <Field>
                      <FieldLabel htmlFor="district">{t('registration.district')}</FieldLabel>
                      <Input id="district" name="district" autoComplete="address-level3" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="street">{t('registration.street')}</FieldLabel>
                      <Input id="street" name="street" autoComplete="street-address" required />
                    </Field>
                  </div>
                  <div className="auth-field-row">
                    <Field>
                      <FieldLabel htmlFor="building-number">{t('registration.buildingNumber')}</FieldLabel>
                      <Input id="building-number" name="buildingNumber" inputMode="numeric" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="postal-code">{t('registration.postalCode')}</FieldLabel>
                      <Input
                        id="postal-code"
                        name="postalCode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="short-address">
                      {t('registration.shortAddress')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="short-address" name="shortAddress" autoComplete="off" />
                  </Field>
                  <p className="business-details-label">{t('registration.cafeLicenses')}</p>
                  <div className="auth-field-row">
                    <Field>
                      <FieldLabel htmlFor="commercial-registration-document">
                        {t('registration.commercialRegistrationDocument')}
                      </FieldLabel>
                      <Input
                        id="commercial-registration-document"
                        name="commercialRegistrationDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        required
                      />
                      <FieldDescription>{t('registration.cafeDocumentUploadHelp')}</FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="operating-license-document">
                        {t('registration.operatingLicenseDocument')}
                      </FieldLabel>
                      <Input
                        id="operating-license-document"
                        name="operatingLicenseDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        required
                      />
                      <FieldDescription>{t('registration.cafeDocumentUploadHelp')}</FieldDescription>
                    </Field>
                  </div>
                </FieldSet>
              )}

              {role === 'supplier' && (
                <FieldSet className="supplier-details">
                  <FieldLegend>{t('registration.supplierLegalDetails')}</FieldLegend>
                  <Field>
                    <FieldLabel htmlFor="supplier-authorization-type">
                      {t('registration.authorizationType')}
                    </FieldLabel>
                    <Select name="authorizationType" required>
                      <SelectTrigger id="supplier-authorization-type" className="w-full">
                        <SelectValue placeholder={t('registration.selectAuthorization')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freelance">{t('registration.freelanceDocument')}</SelectItem>
                        <SelectItem value="productive-family">{t('registration.productiveFamilyCertificate')}</SelectItem>
                        <SelectItem value="commercial-registration">{t('registration.commercialRegistration')}</SelectItem>
                        <SelectItem value="other">{t('registration.otherAuthorization')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authorization-number">
                      {t('registration.authorizationNumber')}
                    </FieldLabel>
                    <Input id="authorization-number" name="authorizationNumber" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authorization-expiry">
                      {t('registration.authorizationExpiry')}
                    </FieldLabel>
                    <Input id="authorization-expiry" name="authorizationExpiry" type="date" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authorization-document">
                      {t('registration.authorizationDocument')}
                    </FieldLabel>
                    <Input
                      id="authorization-document"
                      name="authorizationDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <FieldDescription>{t('registration.documentUploadHelp')}</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="health-certificate-number">
                      {t('registration.healthCertificateNumber')}
                    </FieldLabel>
                    <Input id="health-certificate-number" name="healthCertificateNumber" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="health-certificate-expiry">
                      {t('registration.healthCertificateExpiry')}
                    </FieldLabel>
                    <Input
                      id="health-certificate-expiry"
                      name="healthCertificateExpiry"
                      type="date"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="health-certificate-document">
                      {t('registration.healthCertificateDocument')}
                    </FieldLabel>
                    <Input
                      id="health-certificate-document"
                      name="healthCertificateDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <FieldDescription>{t('registration.documentUploadHelp')}</FieldDescription>
                  </Field>

                  <p className="business-details-label">{t('registration.nationalAddress')}</p>
                  <Field>
                    <FieldLabel htmlFor="supplier-district">{t('registration.district')}</FieldLabel>
                    <Input id="supplier-district" name="district" autoComplete="address-level3" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-street">{t('registration.street')}</FieldLabel>
                    <Input id="supplier-street" name="street" autoComplete="street-address" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-building-number">{t('registration.buildingNumber')}</FieldLabel>
                    <Input id="supplier-building-number" name="buildingNumber" inputMode="numeric" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-postal-code">{t('registration.postalCode')}</FieldLabel>
                    <Input
                      id="supplier-postal-code"
                      name="postalCode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-short-address">
                      {t('registration.shortAddress')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="supplier-short-address" name="shortAddress" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-vat-number">
                      {t('registration.vatNumber')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="supplier-vat-number" name="vatNumber" inputMode="numeric" />
                  </Field>
                  <p className="business-details-note">{t('registration.vatHelp')}</p>
                  <p className="business-details-note">{t('registration.authorizationHelp')}</p>
                </FieldSet>
              )}

              <div className="auth-field-row">
                <Field>
                  <FieldLabel htmlFor="register-password">{t('common.password')}</FieldLabel>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">{t('common.confirmPassword')}</FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>
              </div>
            </FieldGroup>

            {formError && <p className="form-feedback form-error" role="alert">{formError}</p>}
            {message && <p className="form-feedback" role="status">{message}</p>}

            <Button className="auth-submit" type="submit" disabled={submitting}>
              {t('common.createAccount')}
            </Button>
            {role === 'supplier' && message && !formError && (
              <Button
                className="auth-submit"
                type="button"
                variant="outline"
                onClick={() =>
                  navigate('/supplier/dashboard', {
                    state: { businessName: supplierName },
                  })
                }
              >
                {t('supplierDashboard.preview')}
              </Button>
            )}
          </form>

          <div className="auth-footer">
            <Link className="text-button" to="/">
              {t('common.backToRoleSelection')}
            </Link>
            <p className="auth-switch">
              {t('common.alreadyHaveAccount')}{' '}
              <Link to="/login">{t('common.signIn')}</Link>
            </p>
          </div>
        </section>
      </main>
    </AppShell>
  )
}
