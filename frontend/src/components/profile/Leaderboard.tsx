"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface User {
  id: string
  full_name: string
  show_score: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(10)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, requests_sent")
      
      if (error) {
        console.error("Error fetching users:", error)
        setUsers([])
      } else if (data) {
        // Keep only users with a valid full_name
        const validUsers = data
          .filter(u => u.full_name && u.full_name.trim() !== "")
          .map(u => ({
            id: u.id,
            full_name: u.full_name!,
            show_score: u.requests_sent || 0,
          }))

        // Sort descending by score
        const sortedUsers = validUsers.sort((a, b) => b.show_score - a.show_score)
        setUsers(sortedUsers)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  if (loading) return <div className="text-center p-8">Loading...</div>
  if (users.length === 0) return <div className="text-center p-8">No users found.</div>

  const displayedUsers = users.slice(0, displayCount)

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard Table */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u, index) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{u.full_name}</td>
                    <td className="px-3 py-2">{u.show_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length > displayCount && (
            <div className="text-center mt-4">
              <button
                onClick={() => setDisplayCount(prev => prev + 10)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Show More
              </button>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">📊 Analysis</h2>
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={users.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="full_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="show_score" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
