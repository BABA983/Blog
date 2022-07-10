# SOLID 原则

以下内容为本人对 [https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design) 的翻译内容, 如有翻译的不对的地方欢迎指正.

## 介绍

*SOLID* 是 Robert C. Martin (也是我们熟知的 [Uncle Bob](https://en.wikipedia.org/wiki/Robert_C._Martin)) 提出的面向对象设计原则中前 5 个的首字母缩写.

> Note: 这些原则可以应用到各种编程语言当中, 这篇文章的代码示例使用 PHP 写的.
> 

SOLID 代表:

- S - Single-responsibility Principle 单一职责
- O - Open-closed Principle 开闭原则
- L - Liskov Substitution Principle 里氏替换原则
- I - Interface Segregation Principle 接口隔离原则
- D - Dependency Inversion Principle 依赖倒置原则

在这篇文章, 将会单独的为你介绍上面的 5 个原则, 以此来理解 SOLID 使你成为一名更好的开发者.

## 单一职责

单一职责的描述:

> 一个类有且仅有一个原因去改变它, 意味着一个类只干一件事
> 

举个🌰, 有一个应用接收一个几何形状的集合 - 圆形和正方形并且计算这个集合里面所有形状的面积之和.

首先, 创建一个 `shape` 类并且有一个 `constructor` 来设置所需要的参数.

对正方形来说, 你将需要其中一个边的长度 `length`

```php
class Square
{
    public $length;

    public function construct($length)
    {
        $this->length = $length;
    }
}
```

至于圆形, 你需要知道它的半径 `radius`

```php
class Circle
{
    public $radius;

    public function construct($radius)
    {
        $this->radius = $radius;
    }
}
```

接着, 建一个 `AreaCalculator` 类并把计算各种形状面积的逻辑写上去

```php
class AreaCalculator
{
    protected $shapes;

    public function __construct($shapes = [])
    {
        $this->shapes = $shapes;
    }

    public function sum()
    {
        foreach ($this->shapes as $shape) {
            if (is_a($shape, 'Square')) {
                $area[] = pow($shape->length, 2);
            } elseif (is_a($shape, 'Circle')) {
                $area[] = pi() * pow($shape->radius, 2);
            }
        }

        return array_sum($area);
    }

    public function output()
    {
        return implode('', [
          '',
              'Sum of the areas of provided shapes: ',
              $this->sum(),
          '',
      ]);
    }
}
```

为了使用这 `AreaCalculator` 类, 你需要初始化这个类然后把形状以数组的形式传进去并打印输出在页面底部

```php
$shapes = [
  new Circle(2),
  new Square(5),
  new Square(6),
];

$areas = new AreaCalculator($shapes);

echo $areas->output();
```

`output` 方法的问题在于, `AreaCalculator` 这个类处理逻辑去输出结果.

想象一个场景, `output` 应该转换为其他格式, 例如 JSON.

所有的逻辑都将会在 `AreaCalculator` 这个类进行处理. 这么做就会违反单一职责. `AreaCalculator` 类应该只需要担心一件事, 那就是计算集合内所有形状的面积之和. 它不应该关心用户是想要 JSON 还是 HTML 格式.

为了解决这个问题, 你可以新建一个单独的类叫 `SumCalculatorOutputter` 然后用新的类来处理用户想要不同格式的逻辑:

```php
class SumCalculatorOutputter
{
    protected $calculator;

    public function __constructor(AreaCalculator $calculator)
    {
        $this->calculator = $calculator;
    }

    public function JSON()
    {
        $data = [
          'sum' => $this->calculator->sum(),
      ];

        return json_encode($data);
    }

    public function HTML()
    {
        return implode('', [
          '',
              'Sum of the areas of provided shapes: ',
              $this->calculator->sum(),
          '',
      ]);
    }
}
```

`SumCalculatorOutputter` 的用法就像下面这样

```php
$shapes = [
  new Circle(2),
  new Square(5),
  new Square(6),
];

$areas = new AreaCalculator($shapes);
$output = new SumCalculatorOutputter($areas);

echo $output->JSON();
echo $output->HTML();
```

现在, 这个数据格式化的逻辑就被 `SumCalculatorOutputter` 这个类承包了.

这就符合我们的 S - Single-responsibility Principle 单一职责

## 开闭原则

开闭原则的描述:

> 对象或实体应该可以扩展但不能修改
> 

这句话的意思是一个类在不修改自身的情况下可以进行扩展, 让我们重新看 `AreaCalculator` 这个类并关注它的 `sum` 方法

```php
class AreaCalculator
{
    protected $shapes;

    public function __construct($shapes = [])
    {
        $this->shapes = $shapes;
    }

    public function sum()
    {
        foreach ($this->shapes as $shape) {
            if (is_a($shape, 'Square')) {
                $area[] = pow($shape->length, 2);
            } elseif (is_a($shape, 'Circle')) {
                $area[] = pi() * pow($shape->radius, 2);
            }
        }

        return array_sum($area);
    }
}
```

想象一下如果我们的用户想计算其他形状的面积总和, 例如三角形, 五边形, 六边形等等. 你将要不停地编辑这个类并且不断添加 `if`/`else` . 这么做就违反了开闭原则.

一个方法就是我们把计算不同形状面积的逻辑移出 `AreaCalculator` 的类方法挪到各个形状的类里面.

```php
class Square
{
    public $length;

    public function __construct($length)
    {
        $this->length = $length;
    }

    public function area()
    {
        return pow($this->length, 2);
    }
}

class Circle
{
    public $radius;

    public function construct($radius)
    {
        $this->radius = $radius;
    }

    public function area()
    {
        return pi() * pow($shape->radius, 2);
    }
}
```

`sum` 方法将会重写成:

```php
class AreaCalculator
{
    // ...

    public function sum()
    {
        foreach ($this->shapes as $shape) {
            $area[] = $shape->area();
        }

        return array_sum($area);
    }
}
```

现在, 你创建其他类并把它传进去计算的时候就不需要改变 `AreaCalculator` 的 `sum` 方法了.

但是这样又会引起另一个问题了. 你怎么知道你穿进去的对象是一个真正的 `shape` 类呢? 或者说这个对象有 `area` 这个方法呢?

编写一个 `interface` 是 SOLID 不可或缺的一部分

写一个 `ShaperInterface` 来确保有 `area`:

```php
interface ShapeInterface
{
    public function area();
}

class Square implements ShapeInterface
{
    // ...
}

class Circle implements ShapeInterface
{
    // ...
}
```

在 `sum` 方法中, 你可以检查 shapes 是否为 `ShapeInterface` 的实例, 否则抛出异常

```php
class AreaCalculator
{
    // ...

    public function sum()
    {
        foreach ($this->shapes as $shape) {
            if (is_a($shape, 'ShapeInterface')) {
                $area[] = $shape->area();
                continue;
            }

            throw new AreaCalculatorInvalidShapeException();
        }

        return array_sum($area);
    }
}
```

这就满足我们的 O - open-closed principle 开闭原则

## 里氏替换原则

里氏替换原则的描述:

> 假设 q(x) 是一个可证明属性证明 x 对象是类型 T 的. 那么 q(y) 和可以证明对象 y 是属于类型 S 的, 前提是 S 是 T 的子类型.
> 

这意味着每一个子类(派生类)应该是可以替换他们的父类(基类).

在我们的 `AreaCalculator` 类的基础上, 构建一个新的 `VolumeCalculator` 类来继承 `AreaCalculator` 类

```php
class VolumeCalculator extends AreaCalculator
{
    public function construct($shapes = [])
    {
        parent::construct($shapes);
    }

    public function sum()
    {
        // logic to calculate the volumes and then return an array of output
        return [$summedData];
    }
}
```

之前我们写的 `SumCalculatorOutputter` 类是这样的:

```php
class SumCalculatorOutputter {
    protected $calculator;

    public function __constructor(AreaCalculator $calculator) {
        $this->calculator = $calculator;
    }

    public function JSON() {
        $data = array(
            'sum' => $this->calculator->sum();
        );

        return json_encode($data);
    }

    public function HTML() {
        return implode('', array(
            '',
                'Sum of the areas of provided shapes: ',
                $this->calculator->sum(),
            ''
        ));
    }
}
```

如果你像下面这样直接运行:

```php
$areas = new AreaCalculator($shapes);
$volumes = new VolumeCalculator($solidShapes);

$output = new SumCalculatorOutputter($areas);
$output2 = new SumCalculatorOutputter($volumes);
```

当你在 `$output2` 对象调用 `HTML` 方法, 将会报 E_NOTICE 的错误说你将一个数组转换为字符串

为了解决这个问题, 返回 `$summedData` 而不是 `VolumeCalculator` 类 `sum` 方法返回的数组

```php
class VolumeCalculator extends AreaCalculator
{
    public function construct($shapes = [])
    {
        parent::construct($shapes);
    }

    public function sum()
    {
        // logic to calculate the volumes and then return a value of output
        return $summedData;
    }
}
```

`$summedData` 可以是 float, double 或者 integer 类型

这样就满足 L - Liskov substitution principle 里氏替换原则

## 接口隔离原则

接口隔离原则描述:

> 一个客户端不应该强行去实现一个用不到的接口, 或者说不应该依赖于一个不实用的接口
> 

我们依然拿之前的 `ShapeInterface` 例子来说, 你将要支持立方体和球体, 这些形状也需要计算体积.

让我们来看看如果我们直接修改 `ShapeInterface` 增加一个新的方法

```php
interface ShapeInterface
{
    public function area();

    public function volume();
}
```

现在, 你创建的任何一个 `Shape` 都需要去实现 `volume` 方法, 但你知道正方形是二维的他们是没法算出体积的, 因此这个 `interface` 将会强迫 Square 类去实现一个方法它们没用的方法

这就违反了接口隔离原则. 你可以创建个一个有 `volume` 方法新的 `interface` 叫 `ThreeDimensionalShapeInterface` 那么三维的就可以去 `implement` 这个 `interface`

```php
interface ShapeInterface
{
    public function area();
}

interface ThreeDimensionalShapeInterface
{
    public function volume();
}

class Cuboid implements ShapeInterface, ThreeDimensionalShapeInterface
{
    public function area()
    {
        // calculate the surface area of the cuboid
    }

    public function volume()
    {
        // calculate the volume of the cuboid
    }
}
```

这是一个更好的实现, 但要小心一个类型提示的陷阱. 你可以创建一个新的 interface 而不是使用 `ShapeInterface` 或者 `ThreeDimensionalShapeInterface`, 可能叫 `ManageShapeInterface` 在二维和三维的 shapes 上实现

这样你就可以用一个 API 来管理这些形状:

```php
interface ManageShapeInterface
{
    public function calculate();
}

class Square implements ShapeInterface, ManageShapeInterface
{
    public function area()
    {
        // calculate the area of the square
    }

    public function calculate()
    {
        return $this->area();
    }
}

class Cuboid implements ShapeInterface, ThreeDimensionalShapeInterface, ManageShapeInterface
{
    public function area()
    {
        // calculate the surface area of the cuboid
    }

    public function volume()
    {
        // calculate the volume of the cuboid
    }

    public function calculate()
    {
        return $this->area();
    }
}
```

现在在 `AreaCalculator` 类, 你可以用 `calculate` 方法来替代 `area` 方法并且检查对象是否为 `ManageShapeInterface` 而不是 `ShapeInterface` 的实例

这就满足了 I - interface segregation principle 接口隔离原则

## 依赖倒置原则

依赖倒置原则描述:

> 实体必须依赖于抽象, 而不是实现. 他指出, 高层级的模块不依赖于低层级的模块, 但它们都应该依赖于它们的抽象
> 

这个原则考虑到解耦

下面是 `PasswordReminder` 连接 MySQL 数据库的例子:

```php
class MySQLConnection
{
    public function connect()
    {
        // handle the database connection
        return 'Database connection';
    }
}

class PasswordReminder
{
    private $dbConnection;

    public function __construct(MySQLConnection $dbConnection)
    {
        $this->dbConnection = $dbConnection;
    }
}
```

首先 `MySQLConnection` 是低层级模块, 而 `PasswordReminder` 是高层级模块, 但是根据 SOLID 定义中的 **D**, 它指出要依赖于抽象而不是实现. 上面的代码片段就违反了这个原则, `PasswordReminder` 类现在必须依赖于 `MySQLConnection` 类.

第二, 如果你要换数据库, 你就要修改 `PasswordReminder` 类, 这就违反了开闭原则.

`PasswordReminder` 类不应该关心你用的是哪一个数据库. 为了解决这些问题, 你可以写一个高层级和低层级模块都要依赖的抽象 `interface` :

```php
interface DBConnectionInterface
{
    public function connect();
}
```

这个 `interface` 有一个 `connect` 方法, `MySQLConnection` 来实现这个接口. 并且不是直接写这个 `MySQLConnection` 类在 `PasswordReminder` 的构造器里面, 而是用 `DBConnectionInterface` , 这样不管你用的是什么数据库, `PasswordReminder` 都有 `connect` 方法调用, 不需要关心你用的是什么数据库, 在更换数据库的时候对应的类有这个实现的 `connect` 方法就好了. 这就不会违反我们的开闭原则.

```php
class MySQLConnection implements DBConnectionInterface
{
    public function connect()
    {
        // handle the database connection
        return 'Database connection';
    }
}

class PasswordReminder
{
    private $dbConnection;

    public function __construct(DBConnectionInterface $dbConnection)
    {
        $this->dbConnection = $dbConnection;
    }
}
```

这段代码证实不管高层级还是低层级模块都要依赖于它们的抽象

## 总结

在这篇文章当中, 向你介绍了关于 SOLID 原则的代码. 遵循 SOLID 原则的项目可以减少开发者扩展、修改、测试和重构的复杂度.