<template>
  <span :class="badgeClasses">
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import type { MenuStatus } from '~/types/database'

const props = defineProps<{
  status: MenuStatus
}>()

const statusText = computed(() => {
  const statusMap = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved ✓',
    needs_changes: 'Needs Changes'
  }
  return statusMap[props.status] || props.status
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
  const statusClasses = {
    draft: 'bg-slate-100 text-slate-800',
    pending_approval: 'bg-olive-100 text-olive-800',
    approved: 'bg-primary-100 text-primary-800',
    needs_changes: 'bg-brown-100 text-brown-800'
  }
  return `${baseClasses} ${statusClasses[props.status] || statusClasses.draft}`
})
</script>
