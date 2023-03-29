import { useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'

import { Breadcumb } from '../components/Breadcumb'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Symbols } from '../components/Symbols'
import { UserDTO } from '../dtos/userDTO'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { updateUserData } from '../services/UserDataService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'
import { settingsFormValidationSchema } from '../utils/schemaValidations'

const breadcumbNav = [
  {
    label: 'Home',
    link: '/dashboard',
  },
  {
    label: 'Configurações',
  },
]

type SettingsFormData = zod.infer<typeof settingsFormValidationSchema>

export default function Settings() {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const { user, setUserAction } = useAuth()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormValidationSchema),
    defaultValues: useMemo(() => {
      return {
        email: user?.email,
        name: user?.name,
        apiUrl: user?.apiUrl,
        streamUrl: user?.streamUrl,
        accessKey: user?.accessKey,
      }
    }, [user]),
  })

  const { setIsLoggedInAction } = useAuth()

  async function handleSubmitSettings(data: SettingsFormData) {
    const user: UserDTO & { password: string | null } = {
      email: data.email,
      name: data.name,
      password: data.password || null,
      apiUrl: data.apiUrl,
      streamUrl: data.streamUrl,
      accessKey: data.accessKey,
      secretKey: data.secretKey || null,
    }

    const result = await updateUserData(user, token)

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }
    setValue('password', '')
    setValue('passwordConfirmation', '')
    setValue('secretKey', '')
    if (result.data) {
      setUserAction(result.data)
    }

    requestNotificationHandler(result)
  }

  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="col-span-1 md:col-span-12 mt-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Configurações
          </h1>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <Breadcumb itens={breadcumbNav} />
        </div>
        <form
          className="col-span-1 md:col-span-12 mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          onSubmit={handleSubmit(handleSubmitSettings)}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <h1 className="col-span-1 md:col-span-12 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Informações gerais
            </h1>
            <div className="col-span-1 md:col-span-4">
              <Input
                id="email"
                label="E-mail"
                type="email"
                disabled
                {...register('email')}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <Input
                id="password"
                label="Senha"
                placeholder="Digite a nova senha"
                type="password"
                error={errors.password as any}
                {...register('password')}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <Input
                id="passwordConfirmation"
                label="Confirmação de senha"
                placeholder="Confirme a nova senha"
                type="password"
                error={errors.passwordConfirmation as any}
                {...register('passwordConfirmation')}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <Input id="name" label="Nome" {...register('name')} />
            </div>
            <h1 className="col-span-1 md:col-span-12 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mt-8">
              Informações da corretora
            </h1>
            <div className="col-span-1 md:col-span-12">
              <Input
                id="apiUrl"
                label="API URL"
                placeholder="Digite a url da api da Binance a ser utilizada"
                {...register('apiUrl')}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <Input
                id="streamUrl"
                label="STREAM URL"
                placeholder="Digite a url da stream de dados da Binance a ser utilizada"
                {...register('streamUrl')}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <Input
                id="accessKey"
                label="Access Key"
                placeholder="Digite a access key gerada para a api informada"
                {...register('accessKey')}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <Input
                id="secretKey"
                label="Secret Key"
                placeholder="••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
                type="password"
                {...register('secretKey')}
              />
            </div>
            <div className="col-span-1 md:col-span-12 mt-4 md:mt-0">
              <Button
                variant="primary"
                type="submit"
                customWidth="w-full md:w-44 md:ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex flex-row items-center justify-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-4 h-4 mr-2 text-gray-200 bg-transparent animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                    Salvando...
                  </div>
                ) : (
                  <>Salvar</>
                )}
              </Button>
            </div>
          </div>
        </form>
        <Symbols />
      </div>
    </main>
  )
}
