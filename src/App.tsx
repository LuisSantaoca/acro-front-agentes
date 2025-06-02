import { useUserStore } from './stores/useUserStore'

export default function App() {
  const { user, setUser, clearUser } = useUserStore()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Zustand Test</h1>
      <p className="text-lg mb-4">
        Usuario actual: <span className="font-semibold">{user ? user.name : 'No user logged in'}</span>
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => setUser({ id: '1', name: 'Luis' })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Set User
        </button>
        <button
          onClick={clearUser}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear User
        </button>
      </div>
    </div>
  )
}
