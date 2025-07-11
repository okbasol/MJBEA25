import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

export function getAgeGroup(age: number): string {
  if (age >= 7 && age <= 14) return "7-14"
  if (age >= 15 && age <= 18) return "15-18"
  if (age >= 19 && age <= 35) return "19-35"
  return "35+"
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateMemberId(counter: number, season: string): string {
  const paddedCounter = counter.toString().padStart(5, "0")
  return `MJBEA${season}${paddedCounter}`
}
