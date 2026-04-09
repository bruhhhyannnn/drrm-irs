import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserTypes,
  // getUserType,
  createUserType,
  updateUserType,
  deleteUserType,
} from '@/actions';

export function useUserTypes() {
  return useQuery({
    queryKey: ['user_types'],
    queryFn: getUserTypes,
  });
}

// export function useUserType(id?: string) {
//   return useQuery({
//     queryKey: ['user_type', id],
//     queryFn: () => getUserType(id!),
//     enabled: !!id,
//   });
// }

export function useCreateUserType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; is_active?: boolean }) => createUserType(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_types'] }),
  });
}

export function useUpdateUserType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }) =>
      updateUserType(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user_types'] });
      queryClient.invalidateQueries({ queryKey: ['user_type', id] });
    },
  });
}

export function useDeleteUserType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserType(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_types'] }),
  });
}
