// localStorage wrapper for data persistence (replaces MongoDB in v0)

import type { Launch, User } from "./types"

const LAUNCHES_KEY = "gorbchain_launches"
const USERS_KEY = "gorbchain_users"

export const storage = {
  // Launch operations
  getLaunches(): Launch[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(LAUNCHES_KEY)
    return data ? JSON.parse(data) : []
  },

  getLaunchById(id: string): Launch | null {
    const launches = this.getLaunches()
    return launches.find((l) => l._id === id) || null
  },

  getLaunchesByCreator(walletAddress: string): Launch[] {
    const launches = this.getLaunches()
    return launches.filter((l) => l.creatorWallet === walletAddress)
  },

  saveLaunch(launch: Omit<Launch, "_id" | "createdAt" | "updatedAt">): Launch {
    const launches = this.getLaunches()
    const newLaunch: Launch = {
      ...launch,
      _id: `launch_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    launches.push(newLaunch)
    localStorage.setItem(LAUNCHES_KEY, JSON.stringify(launches))
    return newLaunch
  },

  updateLaunch(id: string, updates: Partial<Launch>): Launch | null {
    const launches = this.getLaunches()
    const index = launches.findIndex((l) => l._id === id)
    if (index === -1) return null

    launches[index] = {
      ...launches[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(LAUNCHES_KEY, JSON.stringify(launches))
    return launches[index]
  },

  // User operations
  getUser(walletAddress: string): User | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(USERS_KEY)
    const users: User[] = data ? JSON.parse(data) : []
    return users.find((u) => u.walletAddress === walletAddress) || null
  },

  saveUser(walletAddress: string): User {
    const users = this.getUsers()
    const existing = users.find((u) => u.walletAddress === walletAddress)
    if (existing) return existing

    const newUser: User = {
      walletAddress,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return newUser
  },

  getUsers(): User[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  },
}
