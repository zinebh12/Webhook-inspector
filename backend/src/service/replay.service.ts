import { reconstruct } from '../helpers/reconstructRequest.helper';
import { send } from '../helpers/sendReplayRequest.helper';
import { record } from '../helpers/recordReplayResult.helper';

export const replayService = async (requestId: string, url: string) => {
  const requestData = await reconstruct(requestId);
  const result = await send(requestData, url);
  await record(requestId, url, result);

  return result;
};
