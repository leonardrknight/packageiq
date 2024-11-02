declare module '@/components/ui/button' {
  export const Button: React.FC<{
    children: React.ReactNode
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>
}

declare module '@/components/ui/input' {
  export const Input: React.FC<{
    type?: string
    placeholder?: string
    name?: string
    required?: boolean
  }>
}

declare module '@/components/ui/card' {
  export const Card: React.FC<{
    children: React.ReactNode
    className?: string
  }>
  export const CardHeader: React.FC<{
    children: React.ReactNode
  }>
  export const CardTitle: React.FC<{
    children: React.ReactNode
  }>
  export const CardContent: React.FC<{
    children: React.ReactNode
  }>
} 