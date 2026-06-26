import { createClient } from 'npm:@supabase/supabase-js@2'
import { createOptionsResponse } from '../_shared/cors.ts'
import {
  createErrorResponse,
  createJsonResponse,
  readJsonBody,
} from '../_shared/http.ts'

type ClientScores = {
  electricity: number
  water: number
  gas: number
  consciousness: number
}

type ClientResult = {
  resultCode: string
  scores: ClientScores
}

type SavePayload = {
  inputSnapshot: Record<string, unknown>
  answerSnapshot: Record<string, string>
  clientResult: ClientResult
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const isNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v)

const parseScores = (v: unknown): ClientScores | null => {
  if (!isRecord(v)) return null
  const { electricity, water, gas, consciousness } = v
  if (!isNumber(electricity) || !isNumber(water) || !isNumber(gas) || !isNumber(consciousness)) {
    return null
  }
  return { electricity, water, gas, consciousness }
}

const parsePayload = (body: unknown): SavePayload | null => {
  if (!isRecord(body)) return null

  const { inputSnapshot, answerSnapshot, clientResult } = body

  if (!isRecord(inputSnapshot)) return null
  if (!isRecord(answerSnapshot)) return null
  if (!isRecord(clientResult)) return null

  const { resultCode } = clientResult
  if (typeof resultCode !== 'string' || resultCode.length === 0) return null

  const scores = parseScores(clientResult.scores)
  if (!scores) return null

  return {
    inputSnapshot,
    answerSnapshot: answerSnapshot as Record<string, string>,
    clientResult: { resultCode, scores },
  }
}

const getRequiredEnv = (key: string) => {
  const value = Deno.env.get(key)
  if (!value) throw new Error(`${key} is not configured.`)
  return value
}

const createUserClient = (authorization: string) =>
  createClient(
    getRequiredEnv('SUPABASE_URL'),
    getRequiredEnv('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: authorization } } },
  )

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return createOptionsResponse()

  if (request.method !== 'POST') {
    return createErrorResponse('Method not allowed.', 405)
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization) {
    return createErrorResponse('Authorization header is required.', 401)
  }

  const body = parsePayload(await readJsonBody(request))
  if (!body) {
    return createErrorResponse('Invalid payload.', 400)
  }

  const supabase = createUserClient(authorization)
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return createErrorResponse('Invalid session.', 401)
  }

  const { electricity, water, gas, consciousness } = body.clientResult.scores
  const averageScore = Math.round((electricity + water + gas + consciousness) / 4)

  const { data, error } = await supabase
    .from('assessment_results')
    .insert({
      user_id: userData.user.id,
      result_type: body.clientResult.resultCode,
      comparison_score: averageScore,
      input_snapshot: body.inputSnapshot,
      answer_snapshot: body.answerSnapshot,
      recommendation_snapshot: [],
    })
    .select()
    .single()

  if (error) {
    return createErrorResponse(error.message, 400)
  }

  return createJsonResponse({ savedResult: data }, 201)
})
