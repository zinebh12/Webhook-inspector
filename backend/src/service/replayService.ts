import { reconstruct } from '../helpers/reconstructRequest';
import { send } from '../helpers/sentReplayRequest';
import { record } from '../helpers/recordReplayResult';
import type { ReconstructedRequest } from '../types/express';

export const replayService = async (requestId: string, url: string) => {
  const requestData: ReconstructedRequest = await reconstruct(requestId);
  const result = await send(requestData, url);
  await record(requestId, result, requestData);

  return result;
};
