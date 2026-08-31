// Oxlint 규칙 검출용 검증 파일 (React Compiler 규칙). 고의로 린트 오류를 포함한다.
// 수정하거나 오류를 고치지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

import { useEffect, useRef, useState } from "react"

export function useRenderedRef(): number {
  const valueRef = useRef(0)

  // react/refs (correctness): 렌더링 중 ref.current 읽기.
  return valueRef.current
}

export function useSelection(selectedId: string, itemId: string, theme: string): boolean {
  const [isSelected, setIsSelected] = useState(false)

  // react/set-state-in-effect (correctness): effect 본문에서 상태를 동기적으로 변경.
  // react/exhaustive-effect-dependencies (suspicious): 사용하지 않는 의존성 포함.
  useEffect(() => {
    setIsSelected(selectedId === itemId)
  }, [itemId, selectedId, theme])

  return isSelected
}
