---
title: 'Building a Chip-8 Emulator in Rust'
tags:
  - rust
  - emulator
  - ko
---

Rust로 뭔가는 만들어보고 싶은데 마침 에뮬레이터도 만들어보고 싶어서 입문용 프로젝트로 많이 한다는 Chip-8 에뮬레이터를 작성해보려고 한다. 아직 시작도 안했기 때문에 여기 적을 내용은 많지 않다. 이 포스트를 업데이트해가며 짜려고 한다.

### Update:

생각보다 instruction 개수가 적고 구조도 단순한 편이라 구현이 이틀 정도만에 완성되었다. 좀 생소했던 부분들은 크게 두 가지였는데, 첫 번째는 opcode 구현 시 명세가 인터넷에 있는 참고자료마다 다른 경우가 있었다는 거다. 그래서 뇌피셜 + 다수의 의견을 따라 구현을 했다. 두 번째는 SDL2 사용인데, [SDL2 binding for Rust](https://github.com/Rust-SDL2/rust-sdl2) 의 문서화가 꽤 잘 돼있어서 데모 코드를 참고하니 생각보다 수월했다.

아주 제대로 된 테스팅은 진행하지 않았지만 [테스트 ROM](https://github.com/corax89/chip8-test-rom) 형태로 아주 손쉽게 테스팅해볼 수 있는 방법이 있어서 이 ROM을 실행해보긴 했다. 이 ROM을 통해 잡은 버그는 Rust에서 정수 연산 오버플로우가 자동으로 되지 않는다는 점이었다. 그래서 거의 모든 연산 부분을 그냥 오버플로우가 되도록 수정했다. `Wrapping`이라는 타입으로 해야 하던데 퍼포먼스 저하는 없는 것으로 알고 있다. 그냥 코드가 조금 더 verbose해질 뿐..

오디오 구현은 안(못)했는데 큰 관점에서 중요도가 떨어지는 반면 trivial한 해결 방법이 없어 그냥 냅둔 상태이다. `'\a'` 코드처럼 삑 소리만 나도 충분할 것 같던데 오래된 규약이다 보니 기기마다 `'\a'` 가 작동하지 않는 경우도 C 프로그래밍을 할 때 종종 보았는데 Rust에서는 그냥 지원이 안 되는 것 같았다. 뭔가 내가 모르는 쉬운 방법을 찾거나 아주 미니멀한 오디오 라이브러리를 사용하면 될 것 같다.

이 작은 프로젝트를 통해 에뮬레이터를 조금 더 자세히 이해할 수 있었던 것 같다. 그 다음 단계는 NES나 Gameboy 에뮬레이터 구현일텐데, 난이도 상승 폭이 조금 큰 것으로 보인다.

## Repository

https://github.com/pacokwon/scaters

## References

참고자료들이다. 꽤 오래된 매뉴얼들인데 필요한 내용은 모두 담고 있고 상당히 도움이 많이 되었다.

- http://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf
- http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
