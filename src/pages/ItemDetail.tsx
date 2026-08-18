import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, Item } from '../api/client';

const ItemDetail: React.FC = () => {
  const params = useParams() as { id?: string };
  const id = params.id ?? '0';
  const idNum = Number(id);

  const { data: item, isLoading } = useQuery<Item, Error>({ queryKey: ['items', idNum], queryFn: () => api.getItem(idNum), enabled: !!idNum });

  if (isLoading) return <div className="p-6">Loading item...</div>;
  if (!item) return <div className="p-6">Item not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">{item.name}</h2>
      <p className="mt-2 text-sm">{item.description}</p>
      <p className="mt-2 text-xs text-slate-600">Created: {new Date(item.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default ItemDetail;
