import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import toast from 'react-hot-toast'

import { Button } from '../components/Button'
import { CheckboxInput } from '../components/CheckboxInput'
import { Input } from '../components/Input'
import { ThemeSwitcherButton } from '../components/ThemeSwitcherButton'
import { loginFormValidationSchema } from '../utils/schemaValidations'
import { handleLoginService } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { AxiosErrorDefault } from 'axios'
import { useLocalStorage } from '../hooks/useLocalStorage'

type LoginFormData = zod.infer<typeof loginFormValidationSchema>

export function Login() {
  const [, setJwtToken] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormValidationSchema),
  })

  const navigate = useNavigate()

  async function handleLogin(data: LoginFormData) {
    try {
      const token = await handleLoginService(data)

      if (token) {
        console.log(token)
        setJwtToken(token)
        navigate('/settings')
      }
    } catch (error) {
      const err = error as AxiosErrorDefault

      const message =
        err.response?.data.message || 'Não foi possível fazer login.'
      toast.error(message, {
        position: 'top-right',
      })
    }
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="absolute right-2 top-2">
        <ThemeSwitcherButton />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Bot Cripto
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Acesse sua conta
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <Input
                id="email"
                label="Seu email"
                error={errors.email as any}
                {...register('email')}
              />
              <Input
                label="Senha"
                id="password"
                placeholder="••••••••"
                type="password"
                error={errors.password as any}
                {...register('password')}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <CheckboxInput
                    id="remember"
                    label="Lembre de mim"
                    {...register('remember')}
                  />
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Button type="submit">Sign in</Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Ainda não tem uma conta?{' '}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
