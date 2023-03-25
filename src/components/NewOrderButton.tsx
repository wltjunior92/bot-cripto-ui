import { FaMoneyCheckAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { Button } from './Button'

export function NewOrderButton() {
  const navigate = useNavigate()

  function handleNewOrderClick() {
    navigate('/orders/new-order')
  }
  return (
    <Button onClick={handleNewOrderClick}>
      <>
        <FaMoneyCheckAlt className="w-4 h-4 md:w-6 md:h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white mr-2 fill-white" />
        <span className="text-xs md:text-sm">Nova Ordem</span>
      </>
    </Button>
  )
}
