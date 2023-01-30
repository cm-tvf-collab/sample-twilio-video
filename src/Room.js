import React, { useEffect, useState, useCallback } from "react";
import Participant from "./Participant";
import Video from "twilio-video";


const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [screenParticipants, setScreenParticipants] = useState([])

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };
    room.participants.forEach(participant => {
      participant.on('trackAdded', track => {
        console.log(track)
      });
    });

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));
  // var screenTrack
  const [screenTrack, setScreenTrack] = useState()

  const  shareScreenHandler = useCallback(() => {
    if (!screenTrack) {
      navigator.mediaDevices.getDisplayMedia().then(stream => {
          setScreenTrack(new Video.LocalVideoTrack(stream.getTracks()[0],{name: "screen"}));
          console.log(room)

      }).catch(() => {
          alert('Could not share the screen.');
      });
  }
  else {
      room.localParticipant.unpublishTrack(screenTrack );
      screenTrack.stop();
      setScreenTrack(null);
  }

});
useEffect(() => {
  if(screenTrack) {
    room.localParticipant.publishTrack(screenTrack);
    screenTrack.mediaStreamTrack.onended = () => { shareScreenHandler() };
  }
}, [screenTrack, shareScreenHandler,room.localParticipant])
  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={shareScreenHandler}> Share screen</button>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
        {room.localParticipant && <Participant key="test" participant={screenParticipants}></Participant>}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
