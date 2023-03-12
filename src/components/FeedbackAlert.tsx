import { Alert, AlertProps } from 'flowbite-react'

type FeedbackAlertProps = AlertProps & {
  title?: string
  message: string
}

export function FeedbackAlert({ title, message, ...rest }: FeedbackAlertProps) {
  return (
    <Alert {...rest}>
      <span>
        {title && <span className="font-medium">{`${title} `}</span>}
        {message}
      </span>
    </Alert>
  )
}
