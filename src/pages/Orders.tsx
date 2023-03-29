import { Breadcumb } from '../components/Breadcumb'
import { NewOrderButton } from '../components/NewOrderButton'

const breadcumbNav = [
  {
    label: 'Home',
    link: '/dashboard',
  },
  {
    label: 'Ordens',
  },
]

export default function Orders() {
  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <h1 className="col-span-3 md:col-span-10 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Ordens
          </h1>
          <div className="col-span-3 md:col-span-2">
            <NewOrderButton />
          </div>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <Breadcumb itens={breadcumbNav} />
        </div>
      </div>
    </main>
  )
}
