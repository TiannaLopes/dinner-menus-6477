// Mock Supabase composables for development without database

// In-memory storage for mock data
const mockStorage = {
  weekly_menus: [] as any[],
  menu_items: [] as any[],
  recipes: [] as any[],
  menu_comments: [] as any[],
  menu_status_log: [] as any[]
}

let idCounter = 1

const generateId = () => `mock-id-${idCounter++}`

export const useSupabaseClient = () => {
  return {
    auth: {
      signInWithPassword: async () => ({ 
        data: null, 
        error: { message: 'Mock mode - database not configured. Add Supabase credentials to use authentication.' } 
      }),
      signUp: async () => ({ 
        data: null, 
        error: { message: 'Mock mode - database not configured' } 
      }),
      signOut: async () => ({ error: null })
    },
    from: (table: string) => {
      const storage = mockStorage[table as keyof typeof mockStorage] || []
      
      return {
        select: (columns?: string) => {
          let filteredData = [...storage]
          
          // Handle nested queries for menu items
          if (table === 'weekly_menus' && columns && columns.includes('menu_items')) {
            filteredData = filteredData.map(menu => ({
              ...menu,
              menu_items: mockStorage.menu_items
                .filter(item => item.menu_id === menu.id)
                .map(item => {
                  // Also include recipe if requested
                  if (columns.includes('recipe:recipes')) {
                    const recipe = mockStorage.recipes.find(r => r.id === item.recipe_id)
                    return { ...item, recipe }
                  }
                  return item
                })
            }))
          }
          
          return {
            order: (column: string, options?: any) => {
              const ascending = options?.ascending ?? true
              filteredData.sort((a, b) => {
                if (ascending) return a[column] > b[column] ? 1 : -1
                return a[column] < b[column] ? 1 : -1
              })
              return Promise.resolve({ data: filteredData, error: null })
            },
            eq: (column: string, value: any) => {
              filteredData = filteredData.filter(item => item[column] === value)
              return {
                single: () => {
                  const result = filteredData[0] || null
                  return Promise.resolve({ 
                    data: result, 
                    error: result ? null : { code: 'PGRST116', message: 'Not found' }
                  })
                },
                order: (col: string, opts?: any) => {
                  const ascending = opts?.ascending ?? true
                  filteredData.sort((a, b) => {
                    if (ascending) return a[col] > b[col] ? 1 : -1
                    return a[col] < b[col] ? 1 : -1
                  })
                  return Promise.resolve({ data: filteredData, error: null })
                }
              }
            },
            single: () => {
              const result = filteredData[0] || null
              return Promise.resolve({ data: result, error: null })
            }
          }
        },
        insert: (data: any) => {
          const newItem = {
            ...data,
            id: generateId(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          storage.push(newItem)
          
          return {
            select: (columns?: string) => ({
              single: () => {
                // If inserting menu, add menu_items array for nested query
                if (table === 'weekly_menus') {
                  return Promise.resolve({ 
                    data: { ...newItem, menu_items: [] }, 
                    error: null 
                  })
                }
                return Promise.resolve({ data: newItem, error: null })
              }
            })
          }
        },
        update: (updates: any) => ({
          eq: (column: string, value: any) => {
            const itemIndex = storage.findIndex(item => item[column] === value)
            if (itemIndex >= 0) {
              storage[itemIndex] = {
                ...storage[itemIndex],
                ...updates,
                updated_at: new Date().toISOString()
              }
            }
            return {
              select: (columns?: string) => ({
                single: () => Promise.resolve({ 
                  data: storage[itemIndex] || null, 
                  error: null 
                })
              })
            }
          }
        }),
        delete: () => ({
          eq: (column: string, value: any) => {
            const itemIndex = storage.findIndex(item => item[column] === value)
            if (itemIndex >= 0) {
              storage.splice(itemIndex, 1)
            }
            return Promise.resolve({ error: null })
          }
        })
      }
    }
  }
}

export const useSupabaseUser = () => {
  // Mock user - always signed in for development
  return ref({
    id: 'mock-user-id-123',
    email: 'demo@example.com',
    user_metadata: {
      name: 'Demo User'
    }
  })
}
