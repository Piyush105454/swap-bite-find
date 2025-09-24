import React from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface FoodCardActionsProps {
  likes: number
  isLiked: boolean
  isOwnItem: boolean
  onLike: () => void
  onChat: () => void
  onRequest: () => void // still used for your food_requests insert
}

export const FoodCardActions: React.FC<FoodCardActionsProps> = ({
  likes,
  isLiked,
  isOwnItem,
  onLike,
  onChat,
  onRequest
}) => {
  const handleRequest = async () => {
    // Get currently logged in user from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Not logged in:", userError)
      return
    }

    // Call Supabase RPC to increment score
    const { error } = await supabase.rpc("increment_score", { uid: user.id })

    if (error) {
      console.error("Error updating score:", error)
    } else {
      console.log("Score incremented for user:", user.id)
    }

    // Continue your normal request flow (e.g., insert into food_requests table)
    onRequest()
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Like button */}
        <button
          onClick={onLike}
          className={`flex items-center space-x-1 text-sm transition-colors ${
            isLiked
              ? "text-red-500"
              : "text-gray-500 hover:text-red-500 dark:text-gray-400"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes}</span>
        </button>

        {/* Chat button (only show if not own item) */}
        {!isOwnItem && (
          <button
            onClick={onChat}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </button>
        )}
      </div>

      {/* Request button (only show if not own item) */}
      {!isOwnItem && (
        <Button
          size="sm"
          onClick={handleRequest}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
        >
          Request
        </Button>
      )}
    </div>
  )
}
