import BackLink from "@/components/ui/back-link";

const Series = () => {
  return (
    <div className="container mx-auto pb-8 space-y-8">
      <BackLink href="/" label="Home" />
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Series</h1>
      </div>
    </div>
  )
}

export default Series;