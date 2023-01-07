import React from 'react';
import { Typography, Popover } from 'antd';
const { Text } = Typography;

export default function Slot({ isLoaded, status, slotDetail }) {
  return (
    <Popover content={<SlotDetail status={status} slotDetail={slotDetail} />}>
      <div
        className={`h-8 w-8 rounded-lg ${
          isLoaded ? 'bg-slate-600' : 'bg-slate-200'
        }`}
      ></div>
    </Popover>
  );
}

function SlotDetail({ status, slotDetail }) {
  return (
    <>
      <Text className="font-bold" style={{ width: 100 }} ellipsis>
        {slotDetail ? slotDetail.name : 'Empty'}
      </Text>
      <div>{status}</div>
    </>
  );
}
