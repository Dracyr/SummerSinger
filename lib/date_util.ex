defmodule DateUtil do

  def now do
    :os.timestamp |> milliseconds
  end

  def epoch do
    :os.timestamp |> seconds
  end

  def seconds({mega, sec, _}) do
    (mega * 1_000_000) + sec
  end

  def milliseconds({mega, sec, micro}) do
    rem = precision(micro, 3)
    seconds({mega, sec, micro}) * 1000 + rem
  end

  def precision(number, precision) do
    number
    |> Integer.digits
    |> Enum.take(precision)
    |> Integer.undigits
  end
end
