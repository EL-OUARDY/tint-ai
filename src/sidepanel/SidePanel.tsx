import ColorsTab from '@/components/ColorsTab'
import ExportTab from '@/components/ExportTab'
import Footer from '@/components/Footer'
import GenerateTab from '@/components/GenerateTab'
import Header from '@/components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const SidePanel = () => {
  return (
    <main className="flex h-screen flex-col">
      <div className="bg-background p-2 pb-0">
        <Header />
      </div>
      <div className="flex-1 p-2">
        <Tabs defaultValue="themes" className="flex h-full flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="themes" className="!text-[0.8rem]">
              Themes
            </TabsTrigger>
            <TabsTrigger value="customize" className="!text-[0.8rem]">
              Customize
            </TabsTrigger>
            <TabsTrigger value="contribute" className="!text-[0.8rem]">
              Contribute
            </TabsTrigger>
          </TabsList>
          <TabsContent value="themes" className="flex-1">
            <ColorsTab />
          </TabsContent>
          <TabsContent value="customize" className="flex-1">
            <GenerateTab />
          </TabsContent>
          <TabsContent value="contribute" className="flex-1">
            <ExportTab />
          </TabsContent>
        </Tabs>
      </div>
      <div className="bg-secondary p-2">
        <Footer />
      </div>
    </main>
  )
}

export default SidePanel
