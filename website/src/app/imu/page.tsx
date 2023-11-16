import IMUClassifications from '@/components/IMUClassifications'
import IOTEvents from '@/components/IOTEvents'
import MicClassifications from '@/components/MicClassifications';
import MicData from '@/components/MicData';
import TremorEvents from '@/components/TremorEvents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

const TREMORS = "tremors";
const ACTIVITIES = "activities";
const CLASSIFICATIONS = "classifications"
export default function Home() {
  return (
    <main className="">
      <Tabs defaultValue={ACTIVITIES}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={TREMORS}>Tremors (IMU)</TabsTrigger>
          <TabsTrigger value={ACTIVITIES}>Activities (IMU)</TabsTrigger>
          <TabsTrigger value={CLASSIFICATIONS}>Classifications</TabsTrigger>
        </TabsList>
        <TabsContent value={TREMORS}>
          <TremorEvents/>
        </TabsContent>
        <TabsContent value={ACTIVITIES}>
          <IOTEvents/>
        </TabsContent>
        <TabsContent value={CLASSIFICATIONS}>
          <IMUClassifications/>
        </TabsContent>
      </Tabs>
      {/* <Classifications/>
      <IOTEvents/> */}
    </main>
  )
}
