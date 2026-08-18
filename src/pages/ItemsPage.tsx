import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, NewItem, Item } from '../api/client';

const ItemsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery<Item[], Error>({ queryKey: ['items'], queryFn: () => api.getItems() });
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const create = useMutation({
    mutationFn: (payload: NewItem) => api.createItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });

  const handleCreate = () => {
    if (!name) return;
    create.mutate({ name, description: desc, found: false });
    setName('');
    setDesc('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Items</h2>
      <div className="mb-4 max-w-sm">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full mb-2 rounded border px-3 py-2" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full mb-2 rounded border px-3 py-2" />
        <button onClick={handleCreate} className="rounded bg-indigo-600 px-4 py-2 text-white">Create item</button>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <Link to={`/items/${it.id}`} className="text-indigo-600 underline">{it.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemsPage;
