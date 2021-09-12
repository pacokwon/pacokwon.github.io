---
title: 'Simple State Transformer Monads in Haskell with Examples'
tags:
  - haskell
  - ko
---

_This post is based on [this video](https://www.youtube.com/watch?v=WYysg5Nf7AU) from Graham Hutton's playlist on advanced functional programming. I tried to write this post without rewatching the video, to deliver my own understanding of the concept._

## Defining `StateT`

State를 표현하는 어떤 값이 있을 때, 이 state를 변경시키는 어떤 black box가 있다고 하자. 그 black box는 이렇게 표현할 수 있을 것 같다.

```haskell
black_box :: a -> a -- where a denotes the state's type
```

이때 black box에서 input으로 들어온 state를 이용해 어떤 값을 계산한다고 가정한다면, 현재 함수의 타입 정보로는 해당 결과를 잘 표현하기 어렵다. 따라서 output을 두 개 돌려주는 다음과 같은 타입이 더 편리하다.

```haskell
black_box :: a -> (b, a) -- where a denotes the state's type, and b the return value's type
```

이러한 black box를 `state transformer (StateT)` 이라고 부르기로 하고, 그에 해당하는 새로운 타입을 다음과 같이 작성해보자. Record에 대해 매번 pattern match를 하는 것을 방지하기 위해, `StateT`와 state 값이 주어졌을 때, transformer를 호출해주는 helper 또한 정의하자.

```haskell
newtype StateT a b = S {getStateT :: a -> (b, a)}

runStateT :: StateT a b -> a -> (b, a)
runStateT S {getStateT = f} = f
```

0부터 시작하는 id를 생성하는 함수가 있다고 하자. 이러한 상황에서는 ST를 다음과 같이 표현하여 id를 뽑아낼 수 있을 것이다.

```haskell
-- Plain.hs
next :: StateT Int Int
next = S $ \n -> (n, n + 1)

main :: IO ()
main = do
    let n0 = 0
    let (id, n)     = runStateT next n0
    let (id', n')   = runStateT next n
    let (id'', n'') = runStateT next n'
    print id        -- 0
    print id'       -- 1
    print id''      -- 2
    print n''       -- 3
```

`next` 라는 state transformer를 사용하면 id를 하나 생성하고 state를 하나 증가시키는 것을 확인할 수 있다. 따라서 `id`, `id'`, `id''`등 `next` ST에 새로운 state를 input으로 넣어 생성한 id들은 각각 0, 1, 2, 3의 값을 가지게 된다.

## 기존 방식의 문제점과 `bind` 함수

위 코드에서 문제점이 있다고 할 수 있는 부분은 composition이 불편하다는 점이다. `runStateT` 는 새로운 state를 만들어 내기 때문에, 이 함수를 여러 번 호출해야 하는 상황에서는 최신 state를 잘 넘겨주도록 유의해야 한다. 이를 위해 매번 pattern match를 해야 하고, 매번 state를 explicit하게 넘겨주어야 한다. 흐름 상으로만 보면 반복되는 코드인데 필요는 하기 때문에 일종의 boilerplate인 것이다. 이는 코드를 작성할 때 error prone하고, 읽을 때도 불필요한 디테일이다. 다음과 같은 문제점을 monad를 통해 해결해보자!

먼저 `bind` 함수를 정의해보자. `bind` 의 타입은 다음과 같다.

```haskell
bind :: m a -> (a -> m b) -> m b
```

이때 `m` 은 type constructor으로, 현재 상황의 경우 `StateT s` 에 해당한다.

```haskell
bind :: StateT s a -> (a -> StateT s b) -> StateT s b
```

state transformation을 두 번 시행함으로써 구현할 수 있다.

```haskell
bind :: StateT s a -> (a -> StateT s b) -> StateT s b
bind sa f = S $ \s ->
  let (a, s') = runStateT sa s in runStateT (f a) s'
```

이 함수만 있어도 composition이 더 깔끔해진다. 위에 있는 `main` 함수를 리팩토링해보자.

```haskell
-- Bind.hs
next :: StateT Int Int
next = S $ \n -> (n, n + 1)

main :: IO ()
main = fst $ runStateT (
    next `bind` \id ->
    next `bind` \id' ->
    next `bind` \id'' ->
    S $ \s -> (
      do
        print id
        print id'
        print id'',
      s
    ))
  0
```

(표준 출력을 위한 IO 조작 코드가 있는데...무시하고 보자)

`runStateT` 의 첫 번째 인자로 넘겨진 `StateT` 코드와, 위에 있는 리팩토링 이전 코드를 비교했을 때, trivial한 state 관리 코드가 아예 사라진 것을 확인할 수 있다. composition을 위해 매번 새로운 state를 다음 호출에 넘겨주던 패턴을 `bind` 라는 함수 안에 넣어두었기 때문에 핵심 코드가 더욱 중점적으로 드러나게 되었다.

이 `bind` 라는 함수는 `Monad` 타입클래스에 `(>>=)` 라는 함수의 형태로 존재한다. `StateT` 를 `Monad` 타입클래스의 인스턴스로 만들면 `do` notation의 syntactic sugar 또한 사용할 수 있게 된다. 다만 `Monad` 타입클래스의 인스턴스로 만들기 위해서는 그 superclass인 `Applicative` 까지 구현을 해야 하고, `Applicative` 의 superclass인 `Functor` 까지 구현해야 한다. 구현 코드는 다음과 같이 작성할 수 있다.

```haskell
import Control.Applicative

-- a type that contains a state transformer
-- the state transformer accepts a state, and returns a state with some return value
newtype StateT a b = S {getStateT :: a -> (b, a)}

runStateT :: StateT a b -> a -> (b, a)
runStateT S {getStateT = f} = f

instance Functor (StateT a) where
  -- fmap :: (a -> b) -> StateT s a -> StateT s b
  fmap f (S transform) = S (\s -> let (r, s') = transform s in (f r, s'))

instance Applicative (StateT a) where
  -- pure :: a -> StateT s a
  pure x = S $ \s -> (x, s)

  -- (<*>) :: StateT s (a->b) -> StateT s a -> StateT s b
  sf <*> sa = S $ \s ->
    let (f', s') = runStateT sf s
     in runStateT (f' `fmap` sa) s'

instance Monad (StateT a) where
  -- (>>=) :: StateT s a -> (a -> StateT s b) -> StateT s b
  (S f) >>= t = S $ \s ->
    let (a, s') = f s in runStateT (t a) s'
```

이제 `do` notation을 이용해 코드를 2차로 리팩토링해보자.

```haskell
next :: StateT Int Int
next = S $ \n -> (n, n + 1)

main :: IO ()
main = fst $ runStateT (
  do
    id <- next
    id' <- next
    id'' <- next
    S $ \s ->
      ( do
          print id
          print id'
          print id'',
        s
      )
  )
  0
```

`bind` 호출이 없으니 조금 더 간결해졌다. 마지막으로, `StateT` monad를 사용하는 코드를 분리하여 리팩토링을 해보자.

```haskell
-- Main.hs
next :: StateT Int Int
next = S $ \n -> (n, n + 1)

nextThree :: StateT Int (Int, Int, Int)
nextThree = do
  id <- next
  id' <- next
  id'' <- next
  return (id, id', id'')

getThreeIds :: Int -> (Int, Int, Int)
getThreeIds start = fst $ runStateT nextThree start

main :: IO ()
main = do
  let (id, id', id'') = getThreeIds 0
  print id
  print id'
  print id''
```

특히 처음에 비하면 코드가 훨씬 간결해진 것을 확인할 수 있다.

## Tree Labeling

해당 monad를 또 다른 예시에 적용해보자. 이는 위에 언급된 동영상에 있는 예시이기도 하다.

```haskell
data Tree a = Leaf a | Node (Tree a) (Tree a) deriving Show
```

다음과 같은 트리 자료구조가 있을 때, 각각 leaf마다 숫자 id를 붙여 `label`하는 함수를 작성해보자. 먼저 monad 없이 매뉴얼하게 작성해보자.

```haskell
label :: Tree a -> Int -> (Tree Int, Int)
label (Leaf v) n = (Leaf n, n + 1)
label (Node l r) n = (Node l' r', n'')
  where
    (l', n') = label l n
    (r', n'') = label r n'
```

이 함수는 state를 관리한다. 그 다음에 사용할 id인 `n`이다. 함수를 pure하게 유지하기 위해서는 바늘구멍에 실 궤매듯이 이 state를 계속 들고 다녀야 한다.그럼 위에서 만든 `StateT` 를 이용하여 같은 코드를 작성해보자.

```haskell
mlabel :: Tree a -> StateT Int (Tree Int)
mlabel (Leaf v) = do
  n <- next
  return (Leaf n)

mlabel (Node l r) = do
  l' <- mlabel l
  r' <- mlabel r
  return (Node l' r')
```

실 꿰매듯 state를 운반하는 코드는 더이상 보이지 않는다. 이 함수는 이렇게 사용할 수 있을 것이다.

```haskell
-- Tree.hs
testTree :: Tree String
testTree = Node (Leaf "foo") (Node (Leaf "bar") (Leaf "baz"))

main :: IO ()
main = do
  let labeled = fst $ runStateT (mlabel testTree) 0
  print labeled
```

(`runStateT` 랑 0이 불편하면 다른 함수로 만들어두면 된다...여기선 생략한다)

이로써 순수 함수형 언어인 haskell에서 monad를 통해 state를 깔끔하게 처리하는 방법을 알아보았다! 글을 쓰며 나 역시 많이 배운 것 같다. 이 게시글에서 사용한 코드는 [이 레포](https://github.com/pacokwon/simple-statet-monad-demo)에 업로드되어있다!
