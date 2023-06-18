---
title: '하스켈로 간단한 Lisp 만들기 - 평가'
tags:
  - ko
  - haskell
---

[1부](./20230616-haskell-lisp-parsing)에서는 S-Expression을 파싱하는 법에 대해 간단하게 알아보았다. 이번 포스트에서는 파싱한 결과물을 실행시켜볼 것이다.

먼저 `src/Eval.hs` 파일을 만들자. 거의 모든 작업을 이 파일에서 진행할 것이다. 이 글에서 최종 목표는 아래 두 함수를 완성시키는 것이다.

```haskell
eval :: Sexpr -> Value
repl :: IO ()
```

위 `eval` 함수부터 구현해보자. `eval`은 S-Expression 트리를 입력으로 받고 결과값을 돌려준다.

먼저 결과값인 `Value` 타입을 정의해보자. 일단 숫자는 결과로 나올 것이 당연해 보이니, 우선 `Value`의 종류는 `Int`하나로 정의하고 구현을 하며 점진적으로 그 종류를 늘려가자.

```haskell
data Value = NumV Int
```

이제 가능한 S-Expression을 형태별로 평가해볼 것이다.

### 숫자 평가

숫자 평가는 간단하다. 생성자에 들어있는 값을 꺼내기만 하면 된다.

```haskell
eval (Number n) = n
```

### 식별자 평가

식별자 평가는 애매하다. 아직 언어에 *변수가 없기 때문*이다. 때문에 현재 식별자가 이용될만한 곳은 리스트의 가장 앞쪽에 있는 경우, 즉 함수로 사용되는 경우이다. 아래와 같은 코드가 해당한다.

```lisp
(+ 1 2) ; 3

(max 30 42 7) ; 42
```

가장 앞에 있는 것이 식별자로 파싱이 된다.

근데 또 문제가 있다. 누가 `+`를 더하기 함수로, `max`를 최대값 함수로 정의하는 것일까? 저런 코드가 예상대로 작동하려면, 더하기를 수행하고 최대값을 구하는 로직을 누가 심어둬야 한다. 그것은 우리의 몫이다.

그러니 현재 우리가 할 수 있는 것은, 식별자를 봤을 때 기본 함수로 pre-defined된 식별자라면 함수를 돌려주고, 그렇지 않은 경우에는 에러를 발생시키는 것이다.

그러기 위해서는 우선 함수 값을 만들어야 한다. 아래와 같이 `Value`를 확장시켜보자.

```haskell
data Value = NumV Int
           | Func ([Value] -> Value)
```

Lisp는 꽤 다이나믹한 언어라 `+`와 같은 함수같은 경우에는 명시된 인자 개수가 없이 몇개가 들어와도 전부 더해서 돌려준다. 물론 인자의 개수가 고정되어야 하는 함수의 경우에는 개수가 맞지 않으면 에러를 발생시킨다. 이러한 use case를 모두 커버하기 위해 우리의 함수는 인자를 리스트로 받도록 만들었다.

`+` 함수를 구현해보자. 아래와 같이 짜볼 수 있을 것이다.

```haskell
eval (Ident "+") = Func func
    where
        func = NumV . sum . map mapping
        mapping (NumV n) = n
        mapping _ = error "\"+\" expects a number as argument"
```

하스켈의 `sum` 함수를 활용하니 꽤 간단하다!

`max`도 구현해보자. 마찬가지로 꽤 간단하다.

```haskell
eval (Ident "max") = Func func
    where
        func = NumV . maximum . map mapping
        mapping (NumV n) = n
        mapping _ = error "\"max\" expects a number as argument"
```

다른 식별자를 마주쳤을 때는 에러를 발생시키자. 또 위에 중복되는 `mapping` 함수를 밖으로 뽑아내었다.

```haskell
getNum :: Value -> Int
getNum (NumV n) = n
getNum x = error ("Value must be a NumV value. Got: " ++ show x)

eval :: Sexpr -> Value
eval (Number n) = NumV n
eval (Ident "+") = Func func
    where
        func = NumV . sum . map getNum
eval (Ident "max") = Func func
    where
        func = NumV . maximum . map getNum
eval (Ident x) = error $ "Unknown identifier " ++ x
```

### 리스트 평가

우리는 리스트에서 첫 번째 요소가 "함수"이기를 기대하고 있다. `(+ 1 2 3)` 에서 `+`처럼 말이다. 그 다음은 나머지 요소들을 함수에 넘기기만 하면 되는데, 그 전에 평가를 하고 넘기는 것이 중요하다. 우리 함수는 `Sexpr`이 아닌 `Value` 타입의 인자를 받는다는 것을 기억하자.

다음은 리스트 평가 코드이다.

```haskell
eval (Paren (x:xs)) = getFunc (eval x) (map eval xs)
    where
        getFunc (Func f) = f
        getFunc v = error $ "The first element in a list must be a function. Got: " ++ show v
eval (Paren []) = error "List must not be empty!"
```

비어있는 리스트의 경우 에러를 발생시키고 있다.

## 파서와 합치기

이번 포스트에서는 간단한 평가 로직까지 작성해 보았다. 1부에서 만든 파서와 합쳐서, 임의의 S-Expression을 받아 평가해주는 REPL을 만들어 보자.

### REPL

우선 REPL 코드를 짜보자. 하스켈은 다른 언어와 다르게 IO 처리가 특이해서 먼저 틀을 잡고 가는 것이 편할 것 같다.

가장 먼저 에코 REPL을 만들어볼 것이다. 에코 REPL은 사용자가 입력한 것을 똑같이 출력해주는 REPL이다.

```haskell
import System.IO (hFlush, stdout)

repl :: IO ()
repl = do
    putStr ">> "
    hFlush stdout
    input <- getLine
    putStrLn $ "You entered " ++ input
    repl
```

위 코드가 하는 일은 다음과 같다.

1.  `>> `를 먼저 출력한다. 이는 사용자가 REPL에 들어와 있음을 잘 명시해준다.
2.  `hFlush` 함수를 이용하여 현재 버퍼에 있는 내용을 `stdout`으로 보내버린다. 많은 언어들의 표준 라이브러리가 buffered IO를 사용하기 때문에 `stdout`으로 출력을 하더라도 버퍼에 쌓이기만 하여 나중에 출력 순서가 섞이는 경우가 있다.
3.  `getLine`을 통해 사용자에게서 문자열 입력을 받는다.
4.  입력으로 받은 문자열을 출력한다.
5.  `repl`을 다시 호출하여 `1`~`4`의 과정을 반복한다.

이제 사용자가 `exit`을 입력하면 루프를 종료하는 기능을 추가해보자.

```haskell
import System.IO (hFlush, stdout)

repl :: IO ()
repl = do
    putStr ">> "
    hFlush stdout
    input <- getLine
    if input == "exit" then
        putStrLn "Bye!"
    else do
        putStrLn $ "You entered " ++ input
        repl
```

위에서 하는 일은 간단하다. `input`이 `"exit"` 문자열인 경우에는 재귀호출을 하지 않으면 된다. 이렇게 REPL의 틀을 완성했다!

### 합치기

이제 진짜 합칠 때가 되었다.

사실 아직 안되었다. 유틸리티 함수를 하나만 더 만들겠다. 이건 1부에서 했어야 하는 일이었는데, 바로 사용하기 편리한 `parse` 함수를 만드는 것이다. 이전 포스트에서는 `parseTest`라는 `megaparsec`의 함수를 사용해서 우리의 파서를 편리하게 테스트할 수 있었다. 하지만 그것은 `stdout`에 출력을 가정하는, 말 그대로 테스트용 헬퍼 함수이기 때문에 실제로 결과값만 가져오고 싶은 경우에는 `runParser`를 사용해야 한다.

```haskell
runParser :: Parsec e s a-- Parser to run
    -> String -- Name of source file
    -> s -- Input for parser
    -> Either (ParseErrorBundle s e) a -- Parsed result
```

`runParser`의 시그니처는 위와 같은데, 그냥 사용하기 가장 불편한 이유는 에러 처리와 소스 파일명 인자가 있어서 그렇다. 우리가 어떤 파서를 실행시키고 싶은지(`sexpr`)는 꽤 명확하기도 하다. 이를 둘 다 처리해주는 유틸리티 함수를 `src/Parser.hs`에 아래와 같이 만들었다.

```haskell
parse :: Text -> Sexpr
parse input = case runParser sexpr "" input of
  Right s -> s
  Left e -> error . show $ e
```

이제 모든 조각이 완성되었으니, REPL 안에 합쳐보자.

```haskell
repl :: IO ()
repl = do
    putStr ">> "
    hFlush stdout
    input <- getLine
    if input == "exit" then
        putStrLn "Bye!"
    else do
        print . eval . parse $ input
        repl
```

이제 실행시켜보자!

```plaintext
$ stack exec whisper-exe
>> (+ 1 2)
3
>> (max 2 5 10)
10
>> (max 2 10 (+ 10 2))
12
>> (+ 5 (max 3 7 1))
12
>> exit
Bye!
```

이렇게 그럴듯한 REPL이 완성되었다! 아래는 이번 포스트에서 작업을 했던 `src/Eval.hs`의 전체 코드다.

```haskell
-- src/Eval.hs
module Eval (eval) where

import Parser (Sexpr (..))

data Value = NumV Int
           | Func ([Value] -> Value)

instance Show Value where
    show (NumV n) = show n
    show (Func _) = "<function>"

getNum :: Value -> Int
getNum (NumV n) = n
getNum x = error $ "Value must be a NumV value. Got: " ++ show x

eval :: Sexpr -> Value
eval (Number n) = NumV n
eval (Ident "+") = Func func
    where
        func = NumV . sum . map getNum
eval (Ident "max") = Func func
    where
        func = NumV . maximum . map getNum
eval (Ident x) = error $ "Unknown identifier " ++ x
eval (Paren (x:xs)) = getFunc (eval x) (map eval xs)
    where
        getFunc (Func f) = f
        getFunc v = error $ "The first element in a list must be a function. Got: " ++ show v
eval (Paren []) = error "List must not be empty!"
```

프로젝트의 전체 코드는 https://github.com/pacokwon/whisper 에서 확인할 수 있다.
