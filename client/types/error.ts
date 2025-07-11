export interface ProblemDetail {
  type?: string
  title: string
  status: number
  detail: string
  instance?: string
}

export class ApiError extends Error {
  status: number
  data: ProblemDetail | null

  constructor(message: string, status: number, data: ProblemDetail | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}