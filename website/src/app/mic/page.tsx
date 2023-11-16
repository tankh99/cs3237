import MicClassifications from '@/components/MicClassifications'
import MicData from '@/components/MicData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const CLASSIFICATIONS_MIC = "classifications-mic"
const MIC = "mic"

export default function MicPage() {
  return (
    <div>
      <Tabs defaultValue={MIC}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={MIC}>UPDRS (Microphone)</TabsTrigger>
          <TabsTrigger value={CLASSIFICATIONS_MIC}>Classifications (Microphone)</TabsTrigger>
        </TabsList>
        <TabsContent value={MIC}>
          <MicData/>
        </TabsContent>
        <TabsContent value={CLASSIFICATIONS_MIC}>
          <MicClassifications/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
