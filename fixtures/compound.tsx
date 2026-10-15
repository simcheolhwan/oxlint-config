// Oxlint 규칙 검출용 검증 파일 (compound component 허용). 진단이 없어야 한다.
// 수정하지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

function Root(): null {
  return null
}

function Item(): null {
  return null
}

// react/only-export-components (restriction): allowCompoundComponents가 컴포넌트만 담은 객체 export를 허용.
const SegmentControl = { Root, Item }

export default SegmentControl
