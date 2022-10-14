import Jitsi from 'react-jitsi'
const roomName = '10xFocusHiveRoom'
// const userFullName = 'Joseph Strawberry'

const RenderJitsi = (props: any) => {
    return <Jitsi
    containerStyle={{ width: '100%', height: '500px' }}
    frameStyle={{ display: 'block', width: '100%', height: '100%' }}
    roomName={roomName}
    displayName={props.user.fullName}
    config={{
      enableNoAudioDetection: false,
      startSilent: true,
      startAudioMuted: 1,
    }}
    interfaceConfig={{
      filmStripOnly: true 
    }}
  />
  }

export default RenderJitsi