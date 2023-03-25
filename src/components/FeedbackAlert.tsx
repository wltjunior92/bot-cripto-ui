import { ReactElement } from 'react'

import { Alert, AlertProps } from 'flowbite-react'

type FeedbackAlertProps = AlertProps & {
  title?: string
  message: string
  alertIcon?: ReactElement
}

export function FeedbackAlert({
  title,
  message,
  alertIcon,
  ...rest
}: FeedbackAlertProps) {
  return (
    <Alert {...rest}>
      <span>
        {title && <span className="font-medium">{title}</span>}
        <div className={`flex flex-row items-center ${title && 'mt-2'}`}>
          {!!alertIcon && alertIcon}
          <span className="alert-text">{message}</span>
        </div>
      </span>
    </Alert>
  )
}
