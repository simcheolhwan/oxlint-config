// Oxlint 규칙 검출용 검증 파일 (React Compiler 규칙). 고의로 린트 오류를 포함한다.
// 수정하거나 오류를 고치지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

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

export function useMutatedCounter(): number {
  const [counter] = useState({ value: 0 })

  // react/immutability (correctness): 상태 객체를 직접 변경.
  counter.value = 1
  return counter.value
}

export function useProjectFlag(): boolean {
  const { watch } = useForm<{ isProject: boolean }>()

  // react/incompatible-library (correctness): 메모이제이션과 호환되지 않는 React Hook Form의 watch 호출.
  return watch("isProject")
}

export function useSaveHandler(
  draft: string,
  onSave: (draft: string) => void,
  theme: string,
): () => void {
  // react/exhaustive-deps (correctness): 콜백 본문에서 읽지 않는 의존성 포함.
  // react/memo-dependencies (suspicious): 콜백 본문에서 읽지 않는 의존성 포함.
  return useCallback(() => onSave(draft), [draft, onSave, theme])
}
