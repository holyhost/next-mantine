"use client"
import { connect, MqttClient } from 'mqtt/types/lib/connect';
import React, { createContext, useCallback, useEffect, useState } from 'react'
import * as mqtt from 'mqtt/dist/mqtt'
import Connection from './Connection';
import Receiver from './Receiver';
import Subscriber from './Subscriber';
import Switcher from './Switcher';
import ConfigEdit from './ConfigEdit';



export const QosOption = createContext<any[]>([])
export const Payloads = createContext<any>(null)
const ConfigKey = 'react-App-_iot-common-C0nfig'
export type PayloadType = {
    topic: string,
    message: string,
    qos?: 1
}

export enum ClientConnectStatus {
    Connected='Connected',
    Connecting='Connecting',
    Reconnecting='Reconnecting',
    ConnectError='Connection error',
    DisConnected='DisConnected'
}

type Props = {
    host: {
        protocol: string,
        host: string,
        clientId: string,
        port: number,
        username: string,
        password: string
    },
    devices: any[]
}


export default function Computer({baseinfo}:{baseinfo: Props}) {
    const [client, setClient] = useState<MqttClient>()
    const [isSubed, setIsSub] = useState(false)
    const [host, setHost] = useState(baseinfo.host)
    const [showEditor, setShowEditor] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [payload, setPayload] = useState<PayloadType>()
    const [connectStatus, setConnectStatus] = useState<ClientConnectStatus>(ClientConnectStatus.DisConnected)
    const mqttConnect = useCallback( (host:string, mqttOption:any) => {
        setConnectStatus(ClientConnectStatus.Connecting)
        /**
         * if protocol is "ws", connectUrl = "ws://broker.emqx.io:8083/mqtt"
         * if protocol is "wss", connectUrl = "wss://broker.emqx.io:8084/mqtt"
         *
         * /mqtt: MQTT-WebSocket uniformly uses /path as the connection path,
         * which should be specified when connecting, and the path used on EMQX is /mqtt.
         *
         * for more details about "mqtt.connect" method & options,
         * please refer to https://github.com/mqttjs/MQTT.js#mqttconnecturl-options
         */
        console.log(client)
        console.log("will do setClient")
        setClient(mqtt.connect(host, mqttOption))
        console.log('client',client)
    },[client])

    const autoConnectMqtt = ()=>{
        const { protocol, host, clientId, port, username, password } = baseinfo.host
        const url = `${protocol}://${host}:${port}/mqtt`
        const options = {
            clientId,
            username,
            password,
            clean: true,
            reconnectPeriod: 1000, // ms
            connectTimeout: 30 * 1000, // ms
        }
        mqttConnect(url, options)
    }

    const toggleEditor = useCallback( ()=> setShowEditor(!showEditor),[])

    useEffect(() => {
        // if(!client){
        //     autoConnectMqtt()
        // }
        console.log("...come in effect")
        // console.log(btoa(encodeURIComponent(JSON.stringify(ainfo))))
        // let aa = btoa(encodeURIComponent(JSON.stringify(baseinfo)))
        // console.log(aa)
        // let bb = decodeURIComponent(atob((aa)))
        // console.log(JSON.parse(bb))
        console.log(client)
        if (client) {
            // https://github.com/mqttjs/MQTT.js#event-connect
            client.on('connect', () => {
                console.log("..connect")
                setConnectStatus(ClientConnectStatus.Connected)
                baseinfo.devices.map((device:any)=>{
                    if(device.topic && device.topic.length>0) mqttSub({topic:device.topic,qos:0})
                })

            })

            // https://github.com/mqttjs/MQTT.js#event-error
            client.on('error', (err) => {
                console.error('Connection error: ', err)
                setConnectStatus(ClientConnectStatus.ConnectError)
                client.end()
            })

            // https://github.com/mqttjs/MQTT.js#event-reconnect
            client.on('reconnect', () => {
                setConnectStatus(ClientConnectStatus.Reconnecting)
            })

            // https://github.com/mqttjs/MQTT.js#event-message
            client.on('message', (topic, message) => {
                const payload:PayloadType = { topic, message: message.toString() }
                console.log("on--message")
                setPayload(payload)
            })
        }
        updated && setUpdated(false)
        return ()=>{
            baseinfo.devices.map((device:any)=>mqttUnSub( { topic:device.topic, qos:1 }))
        }
    }, [client,updated])

    // disconnect
    // https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
    const mqttDisconnect = useCallback( () => {
        console.log('come into disconnect')
        console.log('client',client)
        if (client) {
            console.log("....this client")
            try {
                console.log("will end connect..")
                client.end(false, () => {
                    setConnectStatus(ClientConnectStatus.DisConnected)
                    setPayload(undefined)
                })
            } catch (error) {
                console.log(error)
            }
        }
    },[client])

    // publish message
    // https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
    const mqttPublish = (context:PayloadType) => {
        if (client) {
            // topic, QoS & payload for publishing message
            
            const { topic,message,qos } = context
            client.publish(topic, message, { qos,retain:false }, (error) => {
                if (error) {
                }
            })
        }
    }

    const mqttSub = (subscription:any) => {
        if (client) {
            // topic & QoS for MQTT subscribing
            const { topic, qos } = subscription
            // subscribe topic
            // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
            client.subscribe(topic, { qos }, (error:any) => {
                if (error) {
                    return
                }
                setIsSub(true)
            })
        }
    }

    // unsubscribe topic
    // https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
    const mqttUnSub = (subscription:any) => {
        if (client) {
            const { topic, qos } = subscription
            client.unsubscribe(topic, { qos }, (error) => {
                if (error) {
                    return
                }
                setIsSub(false)
            })
        }
    }

    const doSwitcherSort = ()=> {
        baseinfo.devices.push(baseinfo.devices.shift())
        localStorage.setItem(ConfigKey,btoa(encodeURIComponent(JSON.stringify(baseinfo))))
        setUpdated(true)
        
    }
    console.log("Computerrrr...render")
    return (
        <div>
            <Connection
                connect={mqttConnect}
                disconnect={mqttDisconnect}
                connectOptions={host}
                connectStatus={connectStatus}
                toggleEditor = {toggleEditor}
            />
            {showEditor&&<ConfigEdit/>}
            <Payloads.Provider value={payload}>
                {baseinfo.devices.map((device:any)=> 
                    <Switcher
                        doSwitcherSort={doSwitcherSort} 
                        key={device.topic} 
                        device={device}
                        pub={mqttPublish}/>)}
                
                <Subscriber sub={mqttSub} unSub={mqttUnSub}/>
            </Payloads.Provider>
            <Receiver payload={payload}/>
        </div>
    )
}
