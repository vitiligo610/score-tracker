import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

const MatchHeaderSkeleton = () => {
  return (
    <div className="w-full bg-card border-b">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex flex-col space-y-3">
          {/* Tournament/Series Name and Match Info */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-[200px]" />
            
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
          </div>

          {/* Match Details Row */}
          <div className="flex flex-wrap items-center gap-x-6 mt-2">
            <Skeleton className="h-5 w-[80px]" />
            
            <Separator orientation="vertical" className="h-4" />
            
            <Skeleton className="h-5 w-[100px]" />
            
            <Separator orientation="vertical" className="h-4" />
            
            <Skeleton className="h-5 w-[150px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchHeaderSkeleton