// oxlint 규칙 검출 검증용 fixture (React/TanStack Query 훅 규칙). 고의로 린트 오류를 포함한다.
// 수정하거나 오류를 고치지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export function useScaledLogger(factor: number): void {
  // react/exhaustive-deps (correctness): deps 배열에 'factor' 누락.
  useEffect(() => {
    console.info(factor * 2)
  }, [])
}

export function useMaybeState(enabled: boolean): void {
  if (enabled) {
    // react/rules-of-hooks (pedantic): 훅을 조건부(if)로 호출.
    const [value, setValue] = useState(0)
    console.info(value)
    setValue(1)
  }
}

export function useUserData(userId: number): number | undefined {
  // @tanstack/query/exhaustive-deps: queryKey가 queryFn의 'userId'를 누락.
  const result = useQuery({
    queryKey: ["user"],
    queryFn: () => userId * 2,
  })
  return result.data
}
