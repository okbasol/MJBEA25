"use client"

import type { Member } from "@/lib/supabase"
import { calculateAge } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

interface MembershipCardProps {
  member: Member
}

export function MembershipCard({ member }: MembershipCardProps) {
  const age = calculateAge(member.birth_date)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const getImageUrl = async () => {
      if (!member.photo_url || member.photo_url.startsWith("placeholder/")) {
        setImageUrl(null)
        return
      }

      // If it's already a full URL, use it directly
      if (member.photo_url.startsWith("http")) {
        setImageUrl(member.photo_url)
        return
      }

      // Construct Supabase storage URL
      try {
        const { data } = supabase.storage.from("documents").getPublicUrl(member.photo_url)
        if (data?.publicUrl && data.publicUrl !== "") {
          setImageUrl(data.publicUrl)
        } else {
          setImageUrl(null)
        }
      } catch (error) {
        console.warn("Error getting image URL:", error)
        setImageUrl(null)
      }
    }

    getImageUrl()
  }, [member.photo_url])

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
    console.log("Membership card image loaded successfully:", imageUrl)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
    console.log("Membership card image failed to load:", imageUrl)
  }

  return (
    <div className="w-[85.6mm] h-[53.98mm] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-xl shadow-2xl overflow-hidden relative print:shadow-none">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full"></div>

      {/* Header */}
      <div className="bg-white/15 backdrop-blur-sm p-2 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/logo.png" alt="شعار دار الشباب" className="w-7 h-7 rounded-full shadow-md" />
          <h3 className="text-white text-xs font-bold">دار الشباب سليمي إبراهيم</h3>
        </div>
        <p className="text-white/90 text-[8px] font-medium">بئر العاتر - تبسة</p>
      </div>

      {/* Main Content */}
      <div className="p-3 flex gap-3 h-full relative z-10">
        {/* Photo */}
        <div className="w-16 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-white/20">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="صورة المنخرط"
              className="object-cover w-full h-full rounded-lg"
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg">
              <span className="text-gray-500 text-xs font-bold">
                {member.first_name.charAt(0)}
                {member.last_name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-white">
          <h4 className="font-bold text-sm mb-1 text-shadow">
            {member.first_name} {member.last_name}
          </h4>
          <div className="space-y-0.5 text-xs">
            <p className="bg-white/20 backdrop-blur-sm rounded px-2 py-0.5 inline-block">الرقم: {member.member_id}</p>
            <p className="bg-white/20 backdrop-blur-sm rounded px-2 py-0.5 inline-block">
              البطاقة: {member.membership_card_number}
            </p>
            <p className="bg-white/20 backdrop-blur-sm rounded px-2 py-0.5 inline-block">العمر: {age} سنة</p>
            <p className="text-[10px] bg-white/15 backdrop-blur-sm rounded px-2 py-0.5 inline-block mt-1">
              {member.selected_activity}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/15 backdrop-blur-sm p-1 text-center relative z-10">
        <p className="text-white/90 text-[8px] font-medium">صالحة للموسم 2024-2025</p>
      </div>
    </div>
  )
}
