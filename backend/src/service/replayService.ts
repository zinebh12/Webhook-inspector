import { reconstruct } from '../helpers/reconstructRequest';
import { send } from '../helpers/sentReplayRequest';
import { record } from '../helpers/recordReplayResult';

export const replayService = async (requestId: string, url: string) => {
  const requestData = await reconstruct(requestId);
  const result = await send(requestData, url);
  await record(requestId, url, result);

  return result;
};
