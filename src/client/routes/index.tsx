import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState, useTransition, use } from 'react'
import { apiClient } from '../lib/api-client'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

const client = apiClient

const todosPromise = client.todos.$get()
  .then(res => res.json())

const postPromise = client.posts[':id'].$get({
  param: { id: '1' }
}).then(res => res.json())

function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    </div>
  )
}

// ユーザーアイテムを取得するコンポーネント
function UserItemComponent() {
  const [userId, setUserId] = useState('1')
  const [itemId, setItemId] = useState('42')
  const [isPending, startTransition] = useTransition()
  const [userItem, setUserItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // アイテムを取得する関数
  const fetchItem = async () => {
    setIsLoading(true)
    try {
      const response = await client.users[':id'].items[':itemId'].$get({
        param: { id: userId, itemId }
      })
      const data = await response.json()
      startTransition(() => {
        setUserItem(data)
      })
    } catch (error) {
      console.error('アイテム取得エラー:', error)
      startTransition(() => {
        setUserItem(null)
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 初回ロード時にアイテムを取得
  if (!userItem && !isLoading && !isPending) {
    fetchItem()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">ユーザーアイテム詳細</h2>
      
      {/* アイテムID変更UI */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              ユーザーID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
              アイテムID
            </label>
            <input
              type="text"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <button
              onClick={fetchItem}
              disabled={isLoading || isPending}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isLoading || isPending ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading || isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  読み込み中...
                </>
              ) : (
                '取得する'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* アイテム情報表示 */}
      {userItem ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{userItem.name}</h3>
              <p className="text-gray-600 mt-1">{userItem.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-indigo-600">¥{userItem.price.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{userItem.rating}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-500">ユーザーID: {userItem.userId}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-500">商品ID: {userItem.itemId}</span>
            </div>
            <div>
              <span className={`px-2 py-1 text-xs rounded ${userItem.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {userItem.inStock ? '在庫あり' : '在庫なし'}
              </span>
            </div>
          </div>
        </div>
      ) : isLoading || isPending ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500">アイテムが見つかりません</p>
        </div>
      )}
    </div>
  )
}

function DataDisplay() {
  // use フックを使用して、Promise の結果を直接取得
  const todos = use(todosPromise)
  const post = use(postPromise)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">APIレスポンス</h1>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Todos API</h2>
            {todos && todos.todos && todos.todos.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {todos.todos.map((todo) => (
                  <li key={todo.id} className="py-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={todo.completed} 
                        readOnly 
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={`ml-3 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">タスクがありません</p>
            )}
          </div>

          {post ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">記事詳細</h2>
              <article className="prose max-w-none">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <div className="text-sm text-gray-500 mb-4">
                  <span>作成者: {post.author}</span>
                  <span className="mx-2">•</span>
                  <time>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</time>
                </div>
                <p className="text-gray-700">{post.content}</p>
              </article>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">記事が見つかりません</p>
            </div>
          )}

          {/* ユーザーアイテムコンポーネント */}
          <UserItemComponent />
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <DataDisplay />
    </Suspense>
  )
}
