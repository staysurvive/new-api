/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import type { UsageLog } from '../../data/schema'
import { getLogReasoningEffort } from '../format'

const baseLog = {
  id: 1,
  user_id: 1,
  created_at: 0,
  type: 2,
  content: '',
  username: '',
  token_name: '',
  model_name: 'provider-model',
  quota: 0,
  prompt_tokens: 0,
  completion_tokens: 0,
  use_time: 0,
  is_stream: false,
  channel: 0,
  channel_name: '',
  token_id: 0,
  group: '',
  ip: '',
  other: '',
  request_id: '',
  upstream_request_id: '',
  reasoning_effort: null,
} satisfies UsageLog

describe('usage log reasoning effort', () => {
  test('prefers the persisted field and preserves the official value', () => {
    assert.equal(
      getLogReasoningEffort({
        ...baseLog,
        reasoning_effort: 'some-official-value',
        other: '{"reasoning_effort":"legacy"}',
      }),
      'some-official-value'
    )
  })

  test('falls back to the legacy other payload', () => {
    assert.equal(
      getLogReasoningEffort({
        ...baseLog,
        reasoning_effort: null,
        other: '{"reasoning_effort":"high"}',
      }),
      'high'
    )
  })

  test('returns null when no reasoning effort was used', () => {
    assert.equal(
      getLogReasoningEffort({
        ...baseLog,
        reasoning_effort: null,
        other: '{"reasoning_effort":"none"}',
      }),
      null
    )
  })

  test('does not let legacy data override an explicit persisted sentinel', () => {
    assert.equal(
      getLogReasoningEffort({
        ...baseLog,
        reasoning_effort: 'none',
        other: '{"reasoning_effort":"high"}',
      }),
      null
    )
  })

  test('ignores malformed legacy values without throwing', () => {
    assert.equal(
      getLogReasoningEffort({
        ...baseLog,
        other: '{"reasoning_effort":123}',
      }),
      null
    )
  })
})
