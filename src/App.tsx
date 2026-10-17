import { useState, type FormEvent } from 'react'
import { ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('هذه واجهة تجريبية، ولم يتم تسجيل الدخول فعليًا.')
  }

  return (
    <main className="login-page" dir="rtl">
      <div className="login-layout" dir="ltr">
        <div className="login-visual" aria-hidden="true">
          <div className="visual-art">
            <div className="visual-orbit">
              <div className="visual-center">
                <ImageIcon />
              </div>
            </div>
          </div>
        </div>

        <section className="login-panel" dir="rtl" aria-labelledby="login-title">
          <div className="login-content">
            <header className="login-heading">
              <h1 id="login-title">سجّل الدخول إلى حسابك</h1>
              <p>أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك</p>
            </header>

            <form className="login-form" onSubmit={handleSubmit}>
              <FieldGroup className="login-fields">
                <Field>
                  <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    dir="ltr"
                    placeholder="me@example.com"
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    dir="ltr"
                    autoComplete="current-password"
                    required
                  />
                </Field>
              </FieldGroup>

              <div className="login-links">
                <button
                  type="button"
                  onClick={() => setMessage('استعادة كلمة المرور غير مفعّلة في هذه الواجهة التجريبية.')}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <Button className="login-submit" type="submit">
                سجّل الدخول
              </Button>

              <p className="signup-prompt">
                ليس لديك حساب؟{' '}
                <button
                  type="button"
                  onClick={() => setMessage('إنشاء الحساب غير مفعّل في هذه الواجهة التجريبية.')}
                >
                  سجّل الآن
                </button>
              </p>

              {message && (
                <p className="login-message" role="status">
                  {message}
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
