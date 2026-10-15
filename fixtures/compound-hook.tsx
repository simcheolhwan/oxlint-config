// Oxlint 규칙 검출용 검증 파일 (compound component 검출). 고의로 린트 오류를 포함한다.
// 수정하거나 오류를 고치지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

import { useState } from "react"

// react/only-export-components (restriction): 훅이 섞인 객체를 export해 컴포넌트를 검출.
function Root(): null {
  return null
}

function useOpen(): boolean {
  const [isOpen] = useState(false)
  return isOpen
}

const Disclosure = { Root, useOpen }

export default Disclosure
