type HandleLoginProps = {
  email: string
  password: string
  remember: boolean
}

export function handleLoginService({ email, password }: HandleLoginProps) {
  if (email === 'wlt.junior92@gmail.com' && password === '123456') {
    return true
  }
  return false
}
