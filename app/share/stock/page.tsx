"use client"
import { AppLayout } from '@/components/layout/AppLayout'
import { Button, CloseButton, Container, Group, LoadingOverlay, TextInput } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts/core';
import { EChartsOption } from "echarts";
import Charts from "@/components/Echarts";
import { DateInput, DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';


const Stock = () => {

  let [options, setOptions] = useState<EChartsOption>({})
  const [tscode, setTscode] = useState('000010')
  const [futureName, setFutureName] = useState('')
  const [startDate, setStartDate] = useState<DateValue>(new Date())
  const [endDate, setEndDate] = useState<DateValue>(new Date())
  const [visible, { open, close }] = useDisclosure(false);
  const [date, setDate] = useState('')
  const [echarTitle, setEcharTitle] = useState('')
  const [xData, setXData] = useState<string[]>([])
  const [series, setSeries] = useState<any[]>([])
  const colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
  const labelFont = 'bold 12px Sans-serif';
  const option = {
    title: {
      text: echarTitle
    },
    legend: {
      type: 'plain'
    },
    tooltip: {},
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        xAxisIndex: [0, 1],
        top: '90%',
        start: 0,
        end: 100
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: xData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#777' } },
        axisLabel: {
          formatter: function (value: any) {
            return value.slice(-4)
          }
        },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          show: true
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: xData,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#777' } },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          type: 'shadow',
          label: { show: false },
          triggerTooltip: true,
          handle: {
            show: true,
            margin: 30,
            color: '#B80C00'
          }
        }
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 2,
        axisLine: { lineStyle: { color: '#777' } },
        splitLine: { show: true },
        axisTick: { show: false },
        axisLabel: {
          inside: true,
          formatter: '{value}\n'
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    grid: [
      {
        left: 20,
        right: 20,
        top: 110,
        height: 120
      },
      {
        left: 20,
        right: 20,
        height: 40,
        top: 260
      }
    ],
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: 70,
        width: 300,
        bounding: 'raw',
        children: [
          {
            id: 'MA5',
            type: 'text',
            style: { fill: colorList[1], font: labelFont },
            left: 0
          },
          {
            id: 'MA10',
            type: 'text',
            style: { fill: colorList[2], font: labelFont },
            left: 'center'
          },
          {
            id: 'MA20',
            type: 'text',
            style: { fill: colorList[3], font: labelFont },
            right: 0
          }
        ]
      }
    ],
    series
  }
  const getData = async()=> {
    open()
    const d1 = dayjs(startDate).format('YYYYMMDD')
    const d2 = dayjs(endDate).format('YYYYMMDD')
    const result = await fetch(process.env.NEXT_PUBLIC_APP_HOST + '/api/share/'+tscode + "?startDate="+ d1 + "&endDate=" + d2)
    const res = await result.json()
    console.log(res)
    if(res.success && res.data){
      const allItems:any[] = res.data
      console.log(allItems)
      if(allItems.length > 0){
        const items = allItems.sort((a, b) => a.trade_date - b.trade_date)
        console.log(items.map(i => i.trade_date))
        const data = items.map(d => (d ? [d.open || 0,d.close|| 0,d.low|| 0,d.high|| 0]: []))
        setSeries([
          {
            type: 'candlestick',
            name: '日K',
            data: data,
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: {
              color: '#7fbe9e'
            },
            emphasis: {
              itemStyle: {
                color: '#140'
              }
            },
            data: items.map(item => item.volume)
          },
        ])
        setXData(items.map(item => item.trade_date))
      }else{
        setSeries([])
        setXData([])
      }
      
    }
    console.log(visible)
    close()
    
    return res
  }
  const onDateChange = (event: any)=> {
    console.log(event)
    setEndDate(event)
  }
  return (
    <AppLayout>
      <Container mt={'lg'}>
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Group>
            <TextInput
              label="名称"
              placeholder="请输入代码"
              value={tscode}
              onChange={(event) => setTscode(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              w={'8rem'}
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setFutureName('')}
                  style={{ display: futureName ? undefined : 'none' }}
                />
              }
            />
            <DateInput 
              valueFormat="YYYYMMDD"
              label="开始日期"
              w={'7rem'}
              rightSection={<IconCalendar/>}
              value={startDate}
              onChange={(event) => setStartDate(event)}
              placeholder="Date input" />
            <DateInput 
              valueFormat="YYYYMMDD"
              label="结束日期"
              value={endDate}
              w={'7rem'}
              rightSection={<IconCalendar/>}
              onChange={(event) => setEndDate(event)}
              placeholder="Date input" />
            <Button variant="filled" onClick={getData}>查询</Button>
        </Group>
        <Charts options={option} />
      </Container>
    </AppLayout>
  )
}

export default Stock
