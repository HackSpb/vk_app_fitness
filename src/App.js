import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { Alert, View, Panel, PanelHeader, Group, InfoRow,FormLayout, FormLayoutGroup, Input,Select,Radio,Textarea,Checkbox, Link, Button,Div, Slider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';


require('./test.txt');

var user = {first_name: "",last_name:"", sex:0, id:0};


var val = (elem) => {
		console.log(elem)
		return '1';
	}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			popout: null,
			activePanel: 'home',
			fetchedUser: null,
			formReg: {
				sex:0,
				first_name:'',
				last_name:'',
        registered: true,
        message2user: ['','','']
			}
		};


	}

	componentDidMount() {

		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					user=e.detail.data
					this.setState({ fetchedUser: user ,
            config: window.config,
            formReg: {
						sex:user.sex,
						first_name:user.first_name,
						last_name:user.last_name,
						id:user.id
					}});
              this.checkUser();
					break;
				default:
					//console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}
//сохранение контекста через стрел. ф. или bind
	ChangeSt=(event)=> {
			let arr =this.state.formReg
      if(event.target.type=="checkbox") arr[event.target.name] = event.target.checked
      else arr[event.target.name] = event.target.value

	    this.setState({formReg: arr } )
      console.dir(event.target)
			console.log(this.state.formReg)
      console.log('-->>>'+window.supervar)
	  }

		openSheet (text) {
		    this.setState({ popout:
		      <Alert
		        actions={[{
		          title: 'Close',
		          autoclose: true,
		          style: 'destructive'
		        }, {
		          title: 'Cancel',
		          autoclose: true,
		          style: 'cancel'
		        }]}
		        onClose={ () => this.setState({ popout: null }) }
		      >
		        <h2>Hi!</h2>
		        <div className="content" dangerouslySetInnerHTML={{__html: text}}></div>
		      </Alert>
		    });
		  }

checkUser=()=>{
  fetch(this.state.config.urlPhpServer+'checkUser.php?userID='+this.state.formReg.id)
    .then(res => res.json())
    .then(data=> {
      console.log(data)
      if(data.reg)
        this.setState({registered: 1, message2user: data.message2user})

      else
        this.setState({registered: 0})
    }).catch(error => {
      console.log(error);
  });
        console.log(this.state);


}

	ajaxSend=()=>{
  		var data = new FormData();
  		data.append( "json", JSON.stringify( this.state.formReg ) );
      /* https://ftvkapp.beget.tech/saveUser.php */
      console.log(JSON.stringify( this.state.formReg ));
  		fetch(this.state.config.urlPhpServer+"saveUser.php", {
        method: 'post',
        body: data
      })
      .then(res => res.text())
      .then( data=> {
        console.log('Request succeeded with response:', data);
    		this.openSheet(data);
      })
      .catch(error => {
        console.log(error);
    });
    return this;
	}

	go= (e)=>{
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};


	Num($inp) {
    if(isNaN(Number($inp))){
      return null;
    }
    else{
      console.log(Number($inp))
      return Number($inp);
    }
	}



	render() {

    // краткость сестра таланта
let $=this.state.formReg;
var Num=this.Num;
var ChangeSt=this.ChangeSt;

		return (

<View activePanel={this.state.activePanel} popout={this.state.popout}>
  <Panel id="home" theme="white">
    <PanelHeader>Фитнес</PanelHeader>

        <Div><InfoRow title="">
           Приветствуем тебя в нашей системе
          </InfoRow>
				</Div>

        {this.state.message2user}
        { !this.state.registered ?
		      <Div>
           <Button level="commerce" onClick={() =>this.setState({activePanel: 'newuser'})} >Регистрация</Button>
				</Div>
        :''}

   </Panel>
	 <Panel id="everyWeek" theme="white">
     <PanelHeader>Фитнес</PanelHeader>

         <Div><InfoRow title="">
            Еженедельный отчет
           </InfoRow>
 				</Div>
      <Div>
            <Button level="commerce" onClick={() =>this.setState({activePanel: 'newuser'})} >Регистрация</Button>
 				</Div>

        <FormLayout id="form3">
          <Input top="Калории по планке" name="caloriePlank"  value={$.caloriePlank} onChange={ChangeSt}/>
          <Input top="Средний вес за неделю" name="averageWeight" value={$.averageWeight} onChange={ChangeSt}/>
            <Input top="Минимальный вес за неделю" name="minWeight" value={$.minWeight} onChange={ChangeSt}/>
              <Select top="Тренировки (оцените по шкале от 0 до 5, где 0-не тренировались, 5 - активно тренировались)"
                placeholder="Ваша оценка"  name="rateTrainings"  value={$.rateTrainings}  onChange={ChangeSt}>
               <option value="1">1</option>
               <option value="2">1</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
             </Select>

             <Select top="Питание (оцените по шкале 0-5 насколько точно вы придерживались макросов и рекомендаций)"
                placeholder="Ваша оценка"  name="rateNutrition"  value={$.rateNutrition}  onChange={ChangeSt}>
              <option value="1">1</option>
              <option value="2">1</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
        </FormLayout>

    </Panel>

   <Panel id="newuser" theme="white">
    <PanelHeader>Регистрация</PanelHeader>
    	 <Group>
        <Div><InfoRow title="Регистрация">
          Для регистрации просим ответить на несколько вопросов:
          </InfoRow>
			   </Div>
      </Group>
			<FormLayout id="form1">


			<Input top="Имя" name="first_name"  value={$.first_name} onChange={ChangeSt}/>
      <Input top="Фамилия" name="last_name" value={$.last_name} onChange={ChangeSt}/>

       <Select top="Пол" placeholder="Выберите пол"  name="sex" value={$.sex} onChange={ChangeSt}>
        <option value="2">Мужской</option>
        <option value="1">Женский</option>
      </Select>


	  <Select top="Цель" placeholder="Ваша цель" name="myTarget" value={$.myTarget} onChange={ChangeSt}>
        <option value="Похудение">Похудение</option>
        <option value="Реверс">Реверс</option>
        <option value="Набор массы">Набор массы</option>
      </Select>
       <Slider step={1} min={16} max={70} top={"Полных лет " + (($.old)?$.old:"") } name="old" value={$.old}  onChange={val =>{$['old']=val;this.setState({formReg: $})}} />

       <Input top="Рост" type="number" name="height" value={Num($.height)} onChange={ChangeSt}  />
       <Input top="Вес" type="number"  name="weight" value={Num($.weight)} onChange={ChangeSt}/>

	<Input top="Вид спорта"  name="sport" value={$.sport} onChange={ChangeSt}/>
	<Input top="Часов спорта в неделю" type="number" name="hoursport" value={Num($.hoursport)} onChange={ChangeSt} />
	<Input top="Количество дней с тренировками" type="number" name="dayssport" value={$.dayssport} onChange={ChangeSt} />

	  <Select top="Телосложение" placeholder="Тип фигуры" name="typefig" value={$.typefig} onChange={ChangeSt} >
        <option value="Эктоморф/Худощавый">Эктоморф/Худощавый</option>
        <option value="Мышечный/средний">Мышечный/средний</option>
        <option value="Эндоморф/полный">Эндоморф/полный</option>
      </Select>
      <Select top="Характер работы" placeholder="Выберите" name="typejob" value={$.typejob} onChange={ChangeSt}>
        <option value="офис">Малоподвижная, сидячая, офис</option>
        <option value="легкая активность">Лёгкая активность/разъездная работа/весь день на ногах </option>
        <option value="Активный">Активный - лёгкий физический труд - повара/парикмахеры</option>
        <option value="Тяжелый труд">Тяжелый физический труд/строительные работы/грузчик</option>
      </Select>
			<Select top="Повседневная активность" placeholder="Выберите" name="dailyActivity" value={$.dailyActivity} onChange={ChangeSt}>
        <option value="Минимальная">Минимальная (сидячая работа/ноль движения)</option>
        <option value="Ниже среднего">Ниже среднего (прогулки, ежедневный поход за покупками)</option>
        <option value="На ногах">На ногах большую часть дня</option>
        <option value="ЛегкиЙ труд">Легкий ручной труд</option>
				<option value="Тяжелый труд">Тяжелый ручной труд</option>
      </Select>
      <Input top="Есть ли у Вас гормональные нарушения?" name="hormonalDisorder" value={$.hormonalDisorder} onChange={ChangeSt}/>


	<Select top="Уровень стресса" placeholder="Выберите" name="stressLevel" value={$.stressLevel} onChange={ChangeSt}>
				<option value="Без стресса">Без стресса (только переживаю очень во время просмотра новостей по телевизору)</option>
				<option value="По случаю">По случаю (например студент во время сессии)</option>
				<option value="Средний">Средний (полноценная работа с дедлайнами и контактами с другими людьми)</option>
				<option value="Высокий">Высокий (руководящая работа/жёсткий график/высокая ответственность)</option>
			</Select>

		<Slider step={0.5} min={4} max={14} top={"Количество часов сна в среднем " + (($.sleep)?$.sleep:"") } value={Num($.sleep)} onChange={val =>{$['sleep']=val;this.setState({formReg: $})}} />


		 { this.state.formReg.myTarget=="Похудение" ?
       <Select top="Вы растолстели быстро (3-6 мес.) или вес/жир копился годами?" placeholder="Выберите"
				 name="fatquick" value={$.fatquick} onChange={ChangeSt}>
        <option value="Быстро">Быстро</option>
        <option value="Медленно">Медленно</option>
				<option value="Нет проблемы">Нет проблемы/я на массонабор</option>
      	</Select>: null }
      	 { this.state.formReg.myTarget=="Похудение" ?
      	<Select top="Были ли Вы в детстве полным ребенком?" placeholder="Выберите"
					name="fatchild" value={$.fatchild} onChange={ChangeSt}>
        <option value="Нет">Нет</option>
        <option value="Да">Да</option>
      	</Select> : null }
				{ this.state.formReg.sex=='1' ?
		          <Checkbox name="menses" value="да" checked={$.menses} onChange={ChangeSt}>Были ли месячные на этой неделе? </Checkbox>
		 					:''}

              <Checkbox name="foto" value="да" checked={$.foto} onChange={ChangeSt}>Отправляли свое фото нам? </Checkbox>
      <Button size="xl" onClick={() =>this.setState({activePanel: 'measurement'})}>Перейти к измерениям</Button>
    </FormLayout>
  </Panel>
  <Panel id="measurement" theme="white">
    <PanelHeader>Измерения</PanelHeader>
 			 <Div>
					<InfoRow title="">
				Измерьте свои характеристики согласно инструкциям на картинках
				</InfoRow>
         <div style={{'text-align': "center"}}>
           <br /><img src='https://moiglaza.com/wp-content/uploads/2017/03/lehglau-300x210.jpg' /><br />
         </div>
         <Input top="Обхват шеи, см"  type="number" name="girthNeck" value={$.girthNeck} onChange={ChangeSt}  />

         <div style={{'text-align': "center"}}>
           <br /><img src='https://moiglaza.com/wp-content/uploads/2017/03/lehglau-300x210.jpg' /><br />
         </div>
         <Input top="Обхват талии, см"  type="number" name="girthWaist" value={$.girthWaist} onChange={ChangeSt} />
	 { this.state.formReg.sex=='1' ?
         <div style={{'text-align': "center"}} >
           <br /><img src='https://moiglaza.com/wp-content/uploads/2017/03/lehglau-300x210.jpg' /><br />


           <Input  top="Обхват бедер, см"  type="number" name="girthHits" value={$.girthHits} onChange={ChangeSt} />
				 	</div>
					:''}
				 </Div>
 				 <Div>
					 <Button level="outline" onClick={() =>this.setState({activePanel: 'newuser'})} style={{ marginRight: 8 }}>Назад</Button>
           <Button level="commerce" onClick={() =>this.ajaxSend().setState({activePanel: 'home',registered: true})}  >Завершить регистрацию</Button>
				</Div>


   </Panel>
</View>


		);
	}
}

export default App;
