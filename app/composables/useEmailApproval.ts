import emailjs from '@emailjs/browser'

export const useEmailApproval = () => {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()

  // Generate a unique approval token
  const generateApprovalToken = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  // Send approval request email
  const sendApprovalRequest = async (weekId: string, weekStartDate: string) => {
    try {
      // Generate unique token
      const token = generateApprovalToken()
      
      // Store token in database with expiry (7 days)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)
      
      const { error: dbError } = await supabase
        .from('approval_tokens')
        .insert({
          token,
          week_id: weekId,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })
      
      if (dbError) throw dbError

      // Create approval URL
      const approvalUrl = `${window.location.origin}/approve?token=${token}`
      
      // Send email via EmailJS
      const templateParams = {
        to_email: config.public.emailApprover,
        week_date: weekStartDate,
        approval_url: approvalUrl,
        requester_email: config.public.emailRequester
      }

      const response = await emailjs.send(
        config.public.emailjsServiceId,
        config.public.emailjsTemplateId,
        templateParams,
        config.public.emailjsPublicKey
      )

      return { success: true, token }
    } catch (error) {
      console.error('Error sending approval request:', error)
      return { success: false, error }
    }
  }

  // Send approval confirmation email
  const sendApprovalConfirmation = async (weekId: string, weekStartDate: string, comments?: string) => {
    try {
      const templateParams = {
        to_email: config.public.emailRequester,
        week_date: weekStartDate,
        status: 'approved',
        comments: comments || 'No comments',
        menu_url: `${window.location.origin}/menu`
      }

      await emailjs.send(
        config.public.emailjsServiceId,
        config.public.emailjsTemplateId,
        templateParams,
        config.public.emailjsPublicKey
      )

      return { success: true }
    } catch (error) {
      console.error('Error sending confirmation:', error)
      return { success: false, error }
    }
  }

  // Send rejection/edit request email
  const sendEditRequest = async (weekId: string, weekStartDate: string, comments: string) => {
    try {
      const templateParams = {
        to_email: config.public.emailRequester,
        week_date: weekStartDate,
        status: 'changes_requested',
        comments,
        menu_url: `${window.location.origin}/menu`
      }

      await emailjs.send(
        config.public.emailjsServiceId,
        config.public.emailjsTemplateId,
        templateParams,
        config.public.emailjsPublicKey
      )

      return { success: true }
    } catch (error) {
      console.error('Error sending edit request:', error)
      return { success: false, error }
    }
  }

  // Verify approval token
  const verifyToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('approval_tokens')
        .select('*')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .eq('status', 'pending')
        .single()

      if (error || !data) {
        return { valid: false, message: 'Invalid or expired token' }
      }

      return { valid: true, data }
    } catch (error) {
      return { valid: false, message: 'Token verification failed' }
    }
  }

  // Mark token as used
  const markTokenAsUsed = async (token: string, status: 'approved' | 'changes_requested') => {
    try {
      const { error } = await supabase
        .from('approval_tokens')
        .update({ status, used_at: new Date().toISOString() })
        .eq('token', token)

      return { success: !error, error }
    } catch (error) {
      return { success: false, error }
    }
  }

  return {
    sendApprovalRequest,
    sendApprovalConfirmation,
    sendEditRequest,
    verifyToken,
    markTokenAsUsed
  }
}
