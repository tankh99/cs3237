import Classifications from '@/components/Classifications'
import IOTEvents from '@/components/IOTEvents'
import MicData from '@/components/MicData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

const EVENTS = "events";
const ACTIVITY = "activity"
const MIC = "mic"
export default function Home() {
  return (
    <main className="">
      <Tabs defaultValue={EVENTS}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={EVENTS}>Events</TabsTrigger>
          <TabsTrigger value={ACTIVITY}>Activity</TabsTrigger>
          <TabsTrigger value={MIC}>Microphone</TabsTrigger>
        </TabsList>
        <TabsContent value={EVENTS}>
          <IOTEvents/>
        </TabsContent>
        <TabsContent value={ACTIVITY}>
          <Classifications/>
        </TabsContent>
        <TabsContent value={MIC}>
          <MicData/>
        </TabsContent>
      </Tabs>
      {/* <Classifications/>
      <IOTEvents/> */}
    </main>
  )
}
