import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Bar } from 'react-chartjs-2';

interface Inputs {
  text: string,
};

const labels = ['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100']

const options = {
  plugins: {
    title: {
      display: true,
      text: 'ダイスログ集計',
      font: {
        size: 16,
      }
    },
  },
  responsive: true,
  scales: {
    x: {
        stacked: true
    },
    y: {
        stacked: true
    }
  }
}

const groupBy = (numbers: number[]) => {
  const m = new Map();
  for (const number of numbers) {
    const i = Math.trunc((number - 1) / 10)
    m.has(i) ? m.get(i).push(number) : m.set(i, [number])
  }

  const data = new Array(9);
  m.forEach((value, key) => {
    data[key] = value.length
  })
  return data;
}

export default function Form() {
  const [datasets, setDatasets] = useState([{
    label: '探索者名',
    data: [0],
    backgroundColor: 'rgb(255, 99, 132)',
  }]);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit: SubmitHandler<Inputs> = data => buildChart(data);

  const buildChart = (data: Inputs) => {
    const parser = new DOMParser();
    const document = parser.parseFromString(data.text, 'text/html');
    const lines = Array.from(document.getElementsByTagName('p')).filter(item => item.innerText.includes("<=")).reverse();

    const datasets = [];
    const names: string[] = [];
    for (const line of lines) {
      let dice = 0;
      const matched = line.getElementsByTagName('span')[2].innerText.match(/＞ (\d+) ＞/);
      if (matched) {
        dice = Number(matched[1]);
      } else {
        continue;
      }

      const name = line.getElementsByTagName('span')[1].innerText;
      const color = line.style.color;
      if (names.includes(name)) {
        const dataset = datasets.find(dataset => dataset.label === name);
        dataset?.data.push(dice);
      } else {
        datasets.push({label: name, data: [dice], backgroundColor: color});
        names.push(name);
      }
    };

    datasets.forEach(dataset => dataset.data = groupBy(dataset.data));
    return setDatasets(datasets);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea {...register("text", {required: true})} />
        {errors.text && <span>HTMLをコピペしてください</span>}
        <input type="submit" />
      </form>

      <Bar data={{labels: labels, datasets: datasets}} options={options}/>
    </>
  );
}
