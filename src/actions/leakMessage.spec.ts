import { leakMessage, shouldRunLeak } from '@/actions/leakMessage';
import { MessageReaction } from 'discord.js';

describe('🚓 shouldRunLeak', () => {
  it('👮 channel.name が "ごみばこ" 以外のときは undefined を返す', () => {
    const mockObject = { channelName: 'mockChannel', emojiName: 'troll_face' };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 reaction.emoji.name が "troll_face" 以外は undefined を返す', () => {
    const mockObject = { channelName: 'ごみばこ', emojiName: 'mockEmoji' };
    expect(shouldRunLeak(mockObject)).toBe(undefined);
  });

  it('👮 ごみばこチャンネルで "troll_face" の絵文字の場合は true を返す', () => {
    const mockObject = { channelName: 'ごみばこ', emojiName: 'troll_face' };
    expect(shouldRunLeak(mockObject)).toBe(true);
  });
});

describe('🚓 leakMessage', () => {
  it('👮 フィルターを通った場合は reaction.reply.message が発火する', () => {
    const reactionMock = {
      message: {
        channel: {
          name: 'ごみばこ',
        },
        reply: jest.fn(),
      },
      emoji: {
        name: 'troll_face',
      },
    } as unknown as MessageReaction;

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).toHaveBeenCalledWith('補足したぞ');
  });

  it('👮 フィルターを通らない場合は void で早期リターンする', () => {
    const reactionMock = {
      message: {
        channel: {
          name: 'general',
        },
        reply: jest.fn(),
      },
      emoji: {
        name: 'troll_face',
      },
    } as unknown as MessageReaction;

    leakMessage(reactionMock);
    expect(reactionMock.message.reply).not.toHaveBeenCalled();
  });
});
