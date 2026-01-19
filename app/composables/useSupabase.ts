// Mock Supabase composables for development without database

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
    from: (table: string) => ({
      select: (columns?: string) => ({
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null })
        }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      insert: (data: any) => ({
        select: (columns?: string) => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns?: string) => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      })
    })
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
